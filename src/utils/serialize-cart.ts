import type { CartType } from '@/types/cart.type';

function serializeCart(cart: CartType): CartType {
  return {
    ...cart,
    items: cart.items?.map((item) => ({
      ...item,
      price: Number(item.price),
      qty: Number(item.qty),
    })),
    itemsPrice: Number(cart.itemsPrice),
    taxPrice: Number(cart.taxPrice),
    shippingPrice: Number(cart.shippingPrice),
    totalPrice: Number(cart.totalPrice),
    createdAt:
      cart.createdAt instanceof Date
        ? cart.createdAt.toISOString()
        : cart.createdAt,
    updatedAt:
      cart.updatedAt instanceof Date
        ? cart.updatedAt.toISOString()
        : cart.updatedAt,
  };
}

export { serializeCart };

//TODO add prisma middleware later, instead of this file
