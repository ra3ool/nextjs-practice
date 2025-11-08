'use server';

import { authOptions } from '@/lib/auth';
import { handleServiceError } from '@/lib/error-handler';
import { prisma } from '@/lib/prisma-client';
import { ResponseBuilder } from '@/lib/response';
import { insertOrderSchema } from '@/schemas/cart.schema';
import type { CartType, InsertOrderType, OrderType } from '@/types/cart.type';
import type { ServiceResponse } from '@/types/service-response.type';
import { serializePrisma } from '@/utils/serialize-prisma';
import { getServerSession } from 'next-auth';

export const createOrder = async (
  cart: CartType,
  data: InsertOrderType,
): Promise<ServiceResponse<number | null>> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return ResponseBuilder.unauthorized('Authentication required');
    }
    const userId = +session.user.id;

    const orderData = insertOrderSchema.parse(data);

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({
        data: {
          ...orderData,
          userId,
        },
      });

      await tx.orderItems.createMany({
        data: cart.items.map((item) => ({
          orderId: insertedOrder.id,
          productId: item.productId,
          qty: item.qty,
          price: item.price,
        })),
      });

      await tx.cart.deleteMany({
        where: {
          OR: [{ userId }, { userId: null, sessionCartId: cart.sessionCartId }],
        },
      });

      return insertedOrder.id;
    });

    return ResponseBuilder.success(
      insertedOrderId,
      'Order created successfully',
    );
  } catch (error) {
    console.error('Failed to create order:', error);
    return handleServiceError(error);
  }
};

export const getOrdersList = async (): Promise<
  ServiceResponse<OrderType[] | null>
> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return ResponseBuilder.unauthorized('Authentication required');
    }
    const userId = +session.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        OrderItems: true,
        user: { select: { name: true, email: true } },
      },
    });
    if (!orders || orders.length === 0) {
      return ResponseBuilder.success([], 'No orders found');
    }

    return ResponseBuilder.success(
      serializePrisma(orders) as unknown as OrderType[],
      'Orders list fetched',
    );
  } catch (error) {
    console.error('Failed to fetch orders list:', error);
    return handleServiceError(error);
  }
};

export const getOrderById = async (
  id: number,
): Promise<ServiceResponse<OrderType | null>> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return ResponseBuilder.unauthorized('Authentication required');
    }
    const userId = +session.user.id;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        OrderItems: true,
        user: { select: { name: true, email: true } },
      },
    });
    if (!order) {
      return ResponseBuilder.notFound('Order not found');
    }

    return ResponseBuilder.success(
      serializePrisma(order) as unknown as OrderType,
      'Order fetched',
    );
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return handleServiceError(error);
  }
};
