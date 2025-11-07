'use server';

import { authOptions } from '@/lib/auth';
import { handleServiceError } from '@/lib/error-handler';
import { prisma } from '@/lib/prisma-client';
import { ResponseBuilder } from '@/lib/response';
import { shippingAddressSchema } from '@/schemas/cart.schema';
import type { ShippingAddressType } from '@/types/cart.type';
import type { ServiceResponse } from '@/types/service-response.type';
import type { User } from '@prisma/client';
import { getServerSession } from 'next-auth';

export async function getUsers(): Promise<ServiceResponse<User[] | null>> {
  try {
    const users = await prisma.user.findMany();
    if (!users || users.length === 0) {
      return ResponseBuilder.success([], 'No users found');
    }

    return ResponseBuilder.success(users, 'Users fetched');
  } catch (error) {
    console.error('Failed to fetch users list:', error);
    return handleServiceError(error);
  }
}

export async function getUser(
  id: number,
): Promise<ServiceResponse<User | null>> {
  try {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) {
      return ResponseBuilder.notFound('User not found');
    }

    return ResponseBuilder.success(user, 'User fetched');
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return handleServiceError(error);
  }
}

export async function getCurrentUser(): Promise<ServiceResponse<User | null>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return ResponseBuilder.unauthorized('Authentication required');
    }
    const userId = +session.user.id;

    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      return ResponseBuilder.notFound('User not found');
    }

    return ResponseBuilder.success(user, 'User fetched');
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return handleServiceError(error);
  }
}

export async function getUserAddresses(): Promise<
  ServiceResponse<ShippingAddressType[] | null>
> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return ResponseBuilder.unauthorized('Authentication required');
    }
    const userId = +session.user.id;

    const addresses = await prisma.userAddress.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],
    });
    if (!addresses || addresses.length === 0) {
      return ResponseBuilder.success([], 'No address found');
    }

    return ResponseBuilder.success(
      addresses as ShippingAddressType[],
      'Addresses fetched',
    );
  } catch (error) {
    console.error('Failed to fetch user addresses:', error);
    return handleServiceError(error);
  }
}

export async function setDefaultAddress(
  data: ShippingAddressType,
): Promise<ServiceResponse<ShippingAddressType | null>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return ResponseBuilder.unauthorized('Authentication required');
    }
    const userId = +session.user.id;

    const address = shippingAddressSchema.parse(data);

    const updatedAddress = await prisma.$transaction(async (tx) => {
      await tx.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      return await tx.userAddress.update({
        where: {
          id: address.id,
          userId,
        },
        data: { isDefault: true },
      });
    });

    return ResponseBuilder.success(
      updatedAddress as ShippingAddressType,
      'Default address updated',
    );
  } catch (error) {
    console.error('Failed to set default address:', error);
    return handleServiceError(error);
  }
}

export async function updateUserAddress(
  data: ShippingAddressType,
): Promise<ServiceResponse<ShippingAddressType | null>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return ResponseBuilder.unauthorized('Authentication required');
    }
    const userId = +session.user.id;

    const address = shippingAddressSchema.parse(data);

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

    if (address.isDefault) {
      await setDefaultAddress(userAddress as ShippingAddressType);
    }

    return ResponseBuilder.success(
      {
        ...userAddress,
        postalCode: userAddress.postalCode ?? undefined,
        // lat: userAddress.lat ? Number(userAddress.lat) : undefined,
        // lng: userAddress.lng ? Number(userAddress.lng) : undefined,
      },
      `Address ${operation}d`,
    );
  } catch (error) {
    console.error('Failed to update user address:', error);
    return handleServiceError(error);
  }
}

export async function deleteUserAddress(
  data: ShippingAddressType,
): Promise<ServiceResponse<ShippingAddressType | null>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return ResponseBuilder.unauthorized('Authentication required');
    }
    const userId = +session.user.id;

    const address = shippingAddressSchema.parse(data);

    if (address.isDefault) {
      return ResponseBuilder.badRequest("You can't delete default address");
    }

    await prisma.userAddress.delete({
      where: {
        id: address.id,
        userId,
      },
    });

    return ResponseBuilder.success(address, 'Address deleted');
  } catch (error) {
    console.error('Failed to delete address:', error);
    return handleServiceError(error);
  }
}
