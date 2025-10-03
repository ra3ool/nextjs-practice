'use server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cartItemSchema, insertCartSchema } from '@/schemas/cart.schema';
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
  const session = await getServerSession(authOptions);

  let sessionCartId = cookieStore.get('sessionCartId')?.value;
  if (!sessionCartId) {
    sessionCartId = crypto.randomUUID();
    cookieStore.set('sessionCartId', sessionCartId, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return { sessionCartId, userId: session?.user?.id ? +session.user.id : null };
};

/**
 * 🛍️ Get or create cart for current user/guest
 */
const getOrCreateCart = async () => {
  const { sessionCartId, userId } = await getSessionData();

  let cart = await prisma.cart.findUnique({
    where: { sessionCartId },
  });

  if (!cart) {
    const newCartData = {
      sessionCartId,
      ...(userId && { userId }),
      items: [],
      ...calcPrice([]),
    };

    const validated = insertCartSchema.parse(newCartData);
    cart = await prisma.cart.create({ data: validated });
  }

  return cart;
};

/**
 * 🛍️ Get current cart
 */
export const getMyCart = async () => {
  try {
    const cart = await getOrCreateCart();
    return { success: true, cart };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

/**
 * 🛒 Add or update item in cart
 */
export const addItemToCart = async (item: CartItemType) => {
  try {
    const checkedItem = cartItemSchema.parse(item);
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: {
        stock: true,
      },
    });
    if (!product) throw Error('Product not exist');

    const cart = await getOrCreateCart();
    const cartItems = (cart.items as CartItemType[]) ?? [];

    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.productId === checkedItem.productId,
    );

    if (existingItemIndex !== -1) {
      if (product.stock < cartItems[existingItemIndex].qty + checkedItem.qty)
        throw Error('Not enough stock!');

      cartItems[existingItemIndex].qty += checkedItem.qty;
    } else {
      cartItems.push(checkedItem);
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cartItems,
        ...calcPrice(cartItems),
      },
    });

    revalidatePath(`/product/${item.slug}`);
    return {
      success: true,
      message: `Item ${existingItemIndex !== -1 ? 'updated' : 'added to cart'}`,
    };
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

    if (cartItems[existingItemIndex].qty === 1) {
      cartItems = cartItems.filter(
        (item) => item.productId !== cartItems[existingItemIndex].productId,
      );
      existingItemIndex = -1;
    } else {
      cartItems[existingItemIndex].qty -= checkedItem.qty;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cartItems,
        ...calcPrice(cartItems),
      },
    });

    revalidatePath(`/product/${item.slug}`);
    return {
      success: true,
      message: `Item ${
        existingItemIndex !== -1 ? 'updated' : 'removed from cart'
      }`,
    };
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

    const cleared = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: [],
        ...calcPrice([]),
      },
    });

    return { success: true, message: 'Cart cleared', cart: cleared };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};
