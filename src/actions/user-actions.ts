import { apiFetch } from '@/lib/api';
import { User } from 'next-auth'; //TODO override this

const path = 'https://63c2988fe3abfa59bdaf89f6.mockapi.io/users';

export async function getUsers() {
  return apiFetch<User[]>(path, {
    tags: ['users'], // cache tag
    revalidate: 60, // ISR: refresh every 60s
  });
}

export async function getUser(id: string) {
  return apiFetch<User>(`${path}/${id}`, {
    tags: [`user-${id}`],
    revalidate: 60,
  });
}

export async function createUser(data: { name: string }) {
  return apiFetch<User>('${path}', { method: 'POST', body: data });
}

export async function updateUser(id: string, data: Partial<User>) {
  return apiFetch<User>(`${path}/${id}`, { method: 'PUT', body: data });
}

export async function deleteUser(id: string) {
  return apiFetch(`${path}/${id}`, { method: 'DELETE' });
}
