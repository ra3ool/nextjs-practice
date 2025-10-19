'use server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cartItemSchema } from '@/schemas/cart.schema';
import { CartItemType } from '@/types/cart.type';
import { round2 } from '@/utils/round2';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const calcPrice = (items: CartItemType[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.qty, 0),
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(itemsPrice * 0.1);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

const getSessionData = async () => {
  const cookieStore = await cookies();
  let sessionCartId = cookieStore.get('sessionCartId')?.value;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? +session.user.id : null;

  if (!sessionCartId) {
    sessionCartId = crypto.randomUUID();
    cookieStore.set('sessionCartId', sessionCartId, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return { sessionCartId, userId };
};

/**
 * 🛍️ Get or create cart for current user/guest
 */
const getOrCreateCart = async (txClient = prisma) => {
  const { sessionCartId, userId } = await getSessionData();

  //FIXME consider that each user only has one cart in db and merge carts if more
  return await txClient.cart.upsert({
    where: { sessionCartId },
    create: {
      sessionCartId,
      ...(userId && { userId }),
      items: [],
      ...calcPrice([]),
    },
    update: {
      ...(userId && { userId }), // link cart to user if they just logged in
    },
  });
};

/**
 * 🛍️ Get current cart
 */
export const getMyCart = async () => {
  try {
    return await getOrCreateCart();
  } catch (error) {
    return error;
  }
};

/**
 * 🛒 Add or update item in cart
 */
export const addItemToCart = async (item: CartItemType) => {
  try {
    const checkedItem = cartItemSchema.parse(item);
    let message = '';

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: checkedItem.productId },
        select: { stock: true },
      });

      if (!product) throw Error('Product does not exist');

      const cart = await getOrCreateCart(tx as typeof prisma); // use tx client
      const cartItems = (cart.items as CartItemType[]) ?? [];

      const existingItemIndex = cartItems.findIndex(
        (cartItem) => cartItem.productId === checkedItem.productId,
      );

      if (existingItemIndex !== -1) {
        if (
          product.stock <
          cartItems[existingItemIndex].qty + checkedItem.qty
        ) {
          throw Error('Not enough stock!');
        }
        cartItems[existingItemIndex].qty += checkedItem.qty;
        message = 'Item updated';
      } else {
        if (product.stock < checkedItem.qty) throw Error('Not enough stock!');
        cartItems.push(checkedItem);
        message = 'Item added to cart';
      }

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: cartItems,
          ...calcPrice(cartItems),
        },
      });
    });

    revalidatePath(`/product/${checkedItem.slug}`);
    return { success: true, message };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

/**
 * ❌ Remove item from cart
 */
export const removeItemFromCart = async (item: CartItemType) => {
  try {
    const checkedItem = cartItemSchema.parse(item);

    const cart = await getOrCreateCart();
    let cartItems = (cart.items as CartItemType[]) ?? [];

    let existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.productId === checkedItem.productId,
    );
    if (existingItemIndex === -1) throw Error('Item not in the cart');

    let message = '';

    if (cartItems[existingItemIndex].qty === 1) {
      cartItems = cartItems.filter(
        (item) => item.productId !== cartItems[existingItemIndex].productId,
      );
      message = 'Item removed from cart';
    } else {
      cartItems[existingItemIndex].qty -= checkedItem.qty;
      message = 'Item updated';
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cartItems,
        ...calcPrice(cartItems),
      },
    });

    revalidatePath(`/product/${item.slug}`);
    return { success: true, message };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

/**
 * 🧹 Clear entire cart
 */
export const clearCart = async () => {
  try {
    const cart = await getOrCreateCart();

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: [],
        ...calcPrice([]),
      },
    });

    return { success: true, message: 'Cart cleared' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};
