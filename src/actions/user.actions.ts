'use server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cartCheckoutSchema } from '@/schemas/cart.schema';
import { CartCheckoutType } from '@/types/cart.type';
import { getServerSession, User } from 'next-auth';

export async function getUser(id: number): Promise<User | null> {
  try {
    return await prisma.user.findFirst({ where: { id } });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

export async function updateUserAddress(data: CartCheckoutType) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? +session.user.id : null;
    if (!userId) return null;

    const address = cartCheckoutSchema.parse(data);
    console.log('address :', address);

    await prisma.user.update({
      where: { id: userId },
      data: {},
    });

    // TODO make a helper for all response
    return {
      success: true,
      message: '',
      data: [],
    };
  } catch (error) {
    console.error('Failed to update user address:', error);
    return null;
  }
}
