'use server';

import { authOptions } from '@/lib/auth';
import { handleServiceError } from '@/lib/error-handler';
import { prisma } from '@/lib/prisma';
import { ResponseBuilder } from '@/lib/response';
import { insertOrderSchema } from '@/schemas/cart.schema';
import type { CartType, InsertOrderType } from '@/types/cart.type';
import type { ServiceResponse } from '@/types/service-response.type';
import { getServerSession } from 'next-auth';

export const createOrder = async (
  cart: CartType,
  data: Omit<InsertOrderType, 'userId'>,
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

      await tx.orderItem.createMany({
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
