import type { CartItemType } from '@/types/cart.type';

export const mergeCartItems = (
  target: CartItemType[],
  source: CartItemType[],
  stockMap: Record<number, number>,
): CartItemType[] => {
  const map = new Map<number, CartItemType>();

  target.forEach((i) => i.qty > 0 && map.set(i.productId, { ...i }));
  source.forEach((i) => {
    const existing = map.get(i.productId);
    const max = stockMap[i.productId] ?? 0;
    const qty = Math.min((existing?.qty ?? 0) + i.qty, max);
    if (qty > 0) map.set(i.productId, { ...i, qty });
  });

  return Array.from(map.values());
};
