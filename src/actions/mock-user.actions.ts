import { userApi } from '@/lib/api';

export interface User {
  createdAt: string;
  name: string;
  avatar: string;
  dateOfBirth: string;
  country: string;
  city: string;
  street: string;
  zipcode: string;
  company: string;
  email: string;
  phoneNumber: string;
  id: string;
  age: string;
}

const path = '/users';

export async function getUsers(): Promise<User[] | null> {
  try {
    return await userApi<User[]>(path, {
      tags: ['users'],
      revalidate: 60,
      cache: 'force-cache', // Explicit cache strategy
    });
  } catch {
    return null;
  }
}

export async function getUser(id: string): Promise<User | null> {
  try {
    return await userApi<User>(`${path}/${id}`, {
      tags: [`user-${id}`],
      revalidate: 60,
      cache: 'force-cache',
    });
  } catch {
    return null;
  }
}

export async function createUser(data: {
  name: string;
  email: string;
}): Promise<User | null> {
  try {
    return await userApi<User>(path, {
      method: 'POST',
      body: data,
      cache: 'no-store', // Don't cache mutations
    });
  } catch {
    return null;
  }
}

export async function updateUser(
  id: string,
  data: Partial<User>,
): Promise<User | null> {
  try {
    return await userApi<User>(`${path}/${id}`, {
      method: 'PUT',
      body: data,
      cache: 'no-store',
    });
  } catch {
    return null;
  }
}

export async function deleteUser(
  id: string,
): Promise<{ success: boolean } | null> {
  try {
    return await userApi<{ success: boolean }>(`${path}/${id}`, {
      method: 'DELETE',
      cache: 'no-store',
    });
  } catch {
    return null;
  }
}
