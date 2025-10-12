import { getMyCart } from '@/actions/cart.actions';
import { CartTable } from '@/components/cart/cart-table';
import { CartType } from '@/types/cart.type';
import { serializeCart } from '@/utils/serialize-cart';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cart',
};

export default async function CartPage() {
  const cart = serializeCart((await getMyCart()) as CartType);

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
}
