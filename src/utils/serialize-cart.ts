import { CartType } from '@/types/cart.type';

export function serializeCart(cart: CartType) {
  return JSON.parse(
    JSON.stringify(cart, (_, value) => {
      if (typeof value === 'bigint') return Number(value);
      if (
        value &&
        typeof value === 'object' &&
        value.constructor?.name === 'Decimal'
      ) {
        return Number(value);
      }
      if (value instanceof Date) return value.toISOString();
      return value;
    }),
  );
}

//TODO add prisma middleware later, instead of this file
