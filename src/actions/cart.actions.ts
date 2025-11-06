'use server';

import {
  DEFAULT_PAYMENT_METHODS,
  freeShippingLimit,
} from '@/constants/cart.constants';
import { routes } from '@/constants/routes.constants';
import { authOptions } from '@/lib/auth';
import { handleServiceError } from '@/lib/error-handler';
import { prisma } from '@/lib/prisma';
import { ResponseBuilder } from '@/lib/response';
import { cartItemSchema, paymentMethodSchema } from '@/schemas/cart.schema';
import type {
  CartItemType,
  CartType,
  PaymentMethodsType,
} from '@/types/cart.type';
import type { ServiceResponse } from '@/types/service-response.type';
import { mergeCartItems } from '@/utils/cart-merge';
import { round2 } from '@/utils/round2';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const calcPrice = (items: CartItemType[]) => {
  const itemsPrice = round2(items.reduce((acc, i) => acc + i.price * i.qty, 0));
  const taxPrice = round2(itemsPrice * 0.1);
  const shippingPrice = round2(
    itemsPrice === 0 || itemsPrice > freeShippingLimit ? 0 : 10,
  );
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

const getSessionData = async () => {
  const cookieStore = await cookies();
  let sessionCartId = cookieStore.get('sessionCartId')?.value;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? Number(session.user.id) : null;

  if (!sessionCartId) {
    sessionCartId = crypto.randomUUID();
    cookieStore.set('sessionCartId', sessionCartId, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return { sessionCartId, userId };
};

const getOrCreateCart = async (tx: typeof prisma = prisma) => {
  const { sessionCartId, userId } = await getSessionData();

  // ---------- GUEST ----------
  if (!userId) {
    return tx.cart.upsert({
      where: { sessionCartId },
      create: {
        sessionCartId,
        items: [],
        paymentMethod: DEFAULT_PAYMENT_METHODS,
        itemsPrice: 0,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
      },
      update: {},
    });
  }

  // ---------- LOGGED-IN USER ----------
  // 1) collect all carts for user (merge if multiple exist)
  const userCarts = await tx.cart.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });

  let userCart = userCarts[0] ?? null;

  if (userCarts.length > 1) {
    const allItems = userCarts.flatMap(
      (c) => (c.items as CartItemType[]) ?? [],
    );

    const productIds = [...new Set(allItems.map((i) => i.productId))];
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, stock: true },
    });
    const stockMap = Object.fromEntries(products.map((p) => [p.id, p.stock]));

    const mergedItems = mergeCartItems([], allItems, stockMap);
    const prices = calcPrice(mergedItems);

    userCart = await tx.cart.update({
      where: { id: userCart!.id },
      data: {
        items: mergedItems,
        itemsPrice: prices.itemsPrice,
        taxPrice: prices.taxPrice,
        shippingPrice: prices.shippingPrice,
        totalPrice: prices.totalPrice,
      },
    });

    // delete older carts for the user (keep the one we updated)
    await tx.cart.deleteMany({
      where: { userId, id: { not: userCart.id } },
    });
  }

  // 2) merge the current session cart (if any) into user's cart
  const sessCart = await tx.cart.findUnique({
    where: { sessionCartId },
    select: { id: true, items: true },
  });

  if (sessCart && (!userCart || sessCart.id !== userCart.id)) {
    const userItems = (userCart?.items as CartItemType[]) ?? [];
    const sessItems = (sessCart.items as CartItemType[]) ?? [];
    const productIds = [
      ...new Set([...userItems, ...sessItems].map((i) => i.productId)),
    ];

    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, stock: true },
    });
    const stockMap = Object.fromEntries(products.map((p) => [p.id, p.stock]));

    const merged = mergeCartItems(userItems, sessItems, stockMap);
    const prices = calcPrice(merged);

    await tx.cart.delete({ where: { id: sessCart.id } });

    if (!userCart) {
      userCart = await tx.cart.create({
        data: {
          userId,
          sessionCartId,
          items: merged,
          paymentMethod: DEFAULT_PAYMENT_METHODS,
          itemsPrice: prices.itemsPrice,
          taxPrice: prices.taxPrice,
          shippingPrice: prices.shippingPrice,
          totalPrice: prices.totalPrice,
        },
      });
    } else {
      userCart = await tx.cart.update({
        where: { id: userCart.id },
        data: {
          items: merged,
          sessionCartId,
          itemsPrice: prices.itemsPrice,
          taxPrice: prices.taxPrice,
          shippingPrice: prices.shippingPrice,
          totalPrice: prices.totalPrice,
        },
      });
    }

    return userCart;
  }

  // 3) if we still don't have a user cart, create one
  if (!userCart) {
    const prices = calcPrice([]);
    userCart = await tx.cart.create({
      data: {
        sessionCartId,
        userId,
        items: [],
        paymentMethod: DEFAULT_PAYMENT_METHODS,
        itemsPrice: prices.itemsPrice,
        taxPrice: prices.taxPrice,
        shippingPrice: prices.shippingPrice,
        totalPrice: prices.totalPrice,
      },
    });
  }

  return userCart;
};

export const getMyCart = async (): Promise<CartType | Error> => {
  try {
    return (await getOrCreateCart()) as unknown as CartType;
  } catch (e) {
    return e as Error;
  }
};

export const addItemToCart = async (item: CartItemType) => {
  try {
    const checkedItem = cartItemSchema.parse(item);
    let message = '';

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: checkedItem.productId },
        select: { stock: true },
      });
      if (!product) throw new Error('Product does not exist');

      const cart = await getOrCreateCart(tx as typeof prisma);
      const cartItems = (cart.items as CartItemType[]) ?? [];

      const idx = cartItems.findIndex(
        (i) => i.productId === checkedItem.productId,
      );

      if (idx !== -1) {
        const newQty = cartItems[idx].qty + checkedItem.qty;
        if (product.stock < newQty) throw new Error('Not enough stock!');
        cartItems[idx].qty = newQty;
        message = 'Item quantity updated';
      } else {
        if (product.stock < checkedItem.qty)
          throw new Error('Not enough stock!');
        cartItems.push(checkedItem);
        message = 'Item added to cart';
      }

      const prices = calcPrice(cartItems);

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: cartItems,
          itemsPrice: prices.itemsPrice,
          taxPrice: prices.taxPrice,
          shippingPrice: prices.shippingPrice,
          totalPrice: prices.totalPrice,
        },
      });

      return { cartId: cart.id, message };
    });

    revalidatePath(`${routes.product.root}/${checkedItem.slug}`);
    return { success: true, message: result.message };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'An error occurred',
    };
  }
};

export const removeItemFromCart = async (item: CartItemType) => {
  try {
    const checkedItem = cartItemSchema.parse(item);

    const cart = await getOrCreateCart();
    const cartItems = (cart.items as CartItemType[]) ?? [];

    const idx = cartItems.findIndex(
      (i) => i.productId === checkedItem.productId,
    );
    if (idx === -1) throw new Error('Item not in the cart');

    let message = '';
    if (cartItems[idx].qty <= checkedItem.qty) {
      cartItems.splice(idx, 1);
      message = 'Item removed from cart';
    } else {
      cartItems[idx].qty -= checkedItem.qty;
      message = 'Item quantity updated';
    }

    const prices = calcPrice(cartItems);

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cartItems,
        itemsPrice: prices.itemsPrice,
        taxPrice: prices.taxPrice,
        shippingPrice: prices.shippingPrice,
        totalPrice: prices.totalPrice,
      },
    });

    revalidatePath(`${routes.product.root}/${item.slug}`);
    return { success: true, message };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'An error occurred',
    };
  }
};

export const clearCart = async () => {
  try {
    const cart = await getOrCreateCart();
    const empty = calcPrice([]);

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: [],
        itemsPrice: empty.itemsPrice,
        taxPrice: empty.taxPrice,
        shippingPrice: empty.shippingPrice,
        totalPrice: empty.totalPrice,
      },
    });

    return { success: true, message: 'Cart cleared' };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'An error occurred',
    };
  }
};

export const updateCartPaymentMethod = async (
  cart: CartType,
  data: PaymentMethodsType,
): Promise<ServiceResponse<CartType | null>> => {
  try {
    const paymentMethod = paymentMethodSchema.parse(data);

    const updated = await prisma.cart.update({
      where: { id: cart.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return ResponseBuilder.success(
      updated as unknown as CartType,
      'Payment method updated',
    );
  } catch (e) {
    console.error('Failed to update payment method:', e);
    return handleServiceError(e);
  }
};

export const syncCartAfterLogin = async () => {
  await getOrCreateCart();
  revalidatePath('/cart');
  revalidatePath('/', 'layout');
};
