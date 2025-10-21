'use server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  paymentMethodSchema,
  shippingAddressSchema,
} from '@/schemas/cart.schema';
import type {
  PaymentMethodsType,
  ShippingAddressType,
} from '@/types/cart.type';
import { Prisma } from '@prisma/client';
import { getServerSession, User } from 'next-auth';

type ServiceResponse<T> = {
  success: boolean;
  message: string;
  data?: T | null;
};

export async function getUser(id: number): Promise<User | null> {
  try {
    return await prisma.user.findFirst({ where: { id } });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

export async function getUserAddresses(userId: number) {
  try {
    const addresses = await prisma.userAddress.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],
    });
    return addresses || [];
  } catch (error) {
    console.error('Failed to fetch user addresses:', error);
    return [];
  }
}

export async function setDefaultAddress(
  address: ShippingAddressType,
): Promise<ServiceResponse<void>> {
  if (address.isDefault)
    return {
      success: false,
      message: 'Address already set as default',
    };

  try {
    const session = await getServerSession(authOptions);
    const userId = +session!.user!.id;

    await prisma.$transaction(async (tx) => {
      await tx.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      await tx.userAddress.update({
        where: {
          id: address.id,
          userId,
        },
        data: { isDefault: true },
      });
    });

    return {
      success: true,
      message: 'Default address updated successfully',
    };
  } catch (error) {
    console.error('Failed to set default address:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return {
          success: false,
          message: 'Address not found or you do not have permission',
        };
      }
    }

    return {
      success: false,
      message: 'Failed to set default address',
    };
  }
}

export async function updateUserAddress(
  data: ShippingAddressType,
): Promise<ServiceResponse<ShippingAddressType>> {
  try {
    const session = await getServerSession(authOptions);
    const userId = +session!.user!.id;

    const address = shippingAddressSchema.parse(data);

    // Handle default address logic
    if (address.isDefault) {
      await prisma.userAddress.updateMany({
        where: {
          userId,
          isDefault: true,
          ...(address.id && { id: { not: address.id } }), // Exclude current address if updating
        },
        data: { isDefault: false },
      });
    }

    const operation = address.id ? 'update' : 'create';

    const userAddress = await prisma.userAddress.upsert({
      where: {
        id: address.id ?? -1,
        userId,
      },
      create: {
        userId,
        country: address.country,
        city: address.city,
        address: address.address,
        postalCode: address.postalCode || null,
        phoneNumber: address.phoneNumber,
        isDefault: address.isDefault ?? false,
        // lat: address.lat ? new Prisma.Decimal(address.lat) : null,
        // lng: address.lng ? new Prisma.Decimal(address.lng) : null,
      },
      update: {
        country: address.country,
        city: address.city,
        address: address.address,
        postalCode: address.postalCode || null,
        phoneNumber: address.phoneNumber,
        isDefault: address.isDefault ?? false,
        // lat: address.lat ? new Prisma.Decimal(address.lat) : null,
        // lng: address.lng ? new Prisma.Decimal(address.lng) : null,
      },
    });

    return {
      success: true,
      message: `Address ${operation}d successfully`,
      data: {
        ...userAddress,
        postalCode: userAddress.postalCode ?? undefined,
        // lat: userAddress.lat ? Number(userAddress.lat) : undefined,
        // lng: userAddress.lng ? Number(userAddress.lng) : undefined,
      },
    };
  } catch (error) {
    console.error('Failed to update user address:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          return {
            success: false,
            message: 'Address not found or access denied',
          };
        case 'P2002':
          return {
            success: false,
            message: 'Address already exists',
          };
      }
    }

    return {
      success: false,
      message: 'Failed to update user address',
    };
  }
}

export async function deleteUserAddress(address: ShippingAddressType) {
  try {
    if (address.isDefault)
      return { success: false, message: "You can't delete default address!" };

    const session = await getServerSession(authOptions);
    const userId = +session!.user!.id;

    await prisma.userAddress.delete({
      where: {
        id: address.id,
        userId,
      },
    });

    return { success: true, message: 'Address deleted successfully' };
  } catch (error) {
    console.error('Failed to delete address:', error);
    return { success: false, message: 'Failed to delete address' };
  }
}

export async function updateUserPaymentMethod(data: PaymentMethodsType) {
  try {
    const session = await getServerSession(authOptions);
    const userId = +session!.user!.id;

    const paymentMethod = paymentMethodSchema.parse(data);

    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {},
    // });
  } catch (error) {
    console.error('Failed to update payment method:', error);
    return {
      success: false,
      message: 'Failed to update payment method',
    };
  }
}
