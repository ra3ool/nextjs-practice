import { Prisma } from '@/lib/prisma-client';

export function serializePrisma<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }

  if (data instanceof Prisma.Decimal || typeof data === 'bigint') {
    return Number(data.toString()) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map(serializePrisma) as unknown as T;
  }

  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, serializePrisma(value)]),
    ) as T;
  }

  return data;
}
