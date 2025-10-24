import { userApi } from '@/lib/api';
import { handleServiceError } from '@/lib/error-handler';
import { ResponseBuilder } from '@/lib/response';
import type { ServiceResponse } from '@/types/service-response.type';
import { MockUser } from '@/types/user.type';

const path = '/users';

export async function getUsers(): Promise<ServiceResponse<MockUser[] | null>> {
  try {
    const users = await userApi<MockUser[]>(path, {
      tags: ['users'],
      revalidate: 60,
      cache: 'force-cache',
    });

    if (!users || users.length === 0) {
      return ResponseBuilder.success([], 'No users found');
    }

    return ResponseBuilder.success(users, 'Users fetched successfully');
  } catch (error) {
    console.error('Failed to fetch users list:', error);
    return handleServiceError(error);
  }
}

export async function getUser(
  id: string,
): Promise<ServiceResponse<MockUser | null>> {
  try {
    if (!id || typeof id !== 'string') {
      return ResponseBuilder.badRequest('Invalid user ID');
    }

    const user = await userApi<MockUser>(`${path}/${id}`, {
      tags: [`user-${id}`],
      revalidate: 60,
      cache: 'force-cache',
    });

    if (!user) {
      return ResponseBuilder.notFound('User not found');
    }

    return ResponseBuilder.success(user, 'User fetched successfully');
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return handleServiceError(error);
  }
}

export async function createUser(data: {
  name: string;
  email: string;
}): Promise<ServiceResponse<MockUser | null>> {
  try {
    if (!data.name?.trim() || !data.email?.trim()) {
      return ResponseBuilder.badRequest('Name and email are required');
    }

    if (!data.email.includes('@')) {
      return ResponseBuilder.badRequest('Invalid email format');
    }

    const user = await userApi<MockUser>(path, {
      method: 'POST',
      body: data,
      cache: 'no-store',
    });

    return ResponseBuilder.success(user, 'User created successfully');
  } catch (error) {
    console.error('Failed to create user:', error);
    return handleServiceError(error);
  }
}

export async function updateUser(
  id: string,
  data: Partial<MockUser>,
): Promise<ServiceResponse<MockUser | null>> {
  try {
    if (!id || typeof id !== 'string') {
      return ResponseBuilder.badRequest('Invalid user ID');
    }

    const user = await userApi<MockUser>(`${path}/${id}`, {
      method: 'PUT',
      body: data,
      cache: 'no-store',
    });

    return ResponseBuilder.success(user, 'User updated successfully');
  } catch (error) {
    console.error('Failed to update user:', error);
    return handleServiceError(error);
  }
}

export async function deleteUser(
  id: string,
): Promise<ServiceResponse<{ success: boolean } | null>> {
  try {
    if (!id || typeof id !== 'string') {
      return ResponseBuilder.badRequest('Invalid user ID');
    }

    const result = await userApi<{ success: boolean }>(`${path}/${id}`, {
      method: 'DELETE',
      cache: 'no-store',
    });

    return ResponseBuilder.success(result, 'User deleted successfully');
  } catch (error) {
    console.error('Failed to delete user:', error);
    return handleServiceError(error);
  }
}
