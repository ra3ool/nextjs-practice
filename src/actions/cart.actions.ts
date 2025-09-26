'use server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cartItemSchema, insertCartSchema } from '@/schemas/cart.schema';
import { CartItemType } from '@/types/cart.type';
import { round2 } from '@/utils/round2';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

const calcPrice = (items: CartItemType[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.qty, 0),
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 100);
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
      httpOnly: false, // set true if want server-only cookie
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return { sessionCartId, userId: session?.user?.id ? +session.user.id : null };
};

/**
 * 🛒 Add or update a cart item
 */
export const addItemToCart = async (item: CartItemType) => {
  try {
    const { sessionCartId, userId } = await getSessionData();
    const checkedItem = cartItemSchema.parse(item);

    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
    });
    const items = (cart?.items as CartItemType[]) ?? [];

    if (!cart) {
      const newCartData = {
        ...(userId ? { userId } : {}),
        sessionCartId,
        items: [checkedItem],
        ...calcPrice([checkedItem]),
      };

      const validated = insertCartSchema.parse(newCartData);
      cart = await prisma.cart.create({ data: validated });
    } else {
      const existingItemIndex = items.findIndex(
        (item) => item.productId === checkedItem.productId,
      );

      if (existingItemIndex !== -1) {
        items[existingItemIndex].qty += checkedItem.qty;
      } else {
        items.push(checkedItem);
      }

      cart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items,
          ...calcPrice(items),
        },
      });
    }

    return { success: true, message: 'Item added to cart', cart };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

/**
 * 🛍️ Get the current user's or guest's cart
 */
export const getMyCart = async () => {
  try {
    const { sessionCartId, userId } = await getSessionData();

    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          sessionCartId,
          ...(userId ? { userId } : {}),
          items: [],
          ...calcPrice([]),
        },
      });
    }

    return { success: true, cart };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

/**
 * ❌ Remove a single item from cart
 */
export const removeItemFromCart = async (productId: number) => {
  try {
    const { sessionCartId, userId } = await getSessionData();

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
    });

    if (!cart) throw new Error('Cart not found');

    const items = (cart.items as CartItemType[]).filter(
      (item) => item.productId !== productId,
    );

    const updated = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items,
        ...calcPrice(items),
      },
    });

    return { success: true, message: 'Item removed', cart: updated };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

/**
 * 🧹 Clear the entire cart
 */
export const clearCart = async () => {
  try {
    const { sessionCartId, userId } = await getSessionData();

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
    });

    if (!cart) throw new Error('Cart not found');

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
