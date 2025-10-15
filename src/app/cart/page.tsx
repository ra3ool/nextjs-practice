import { getMyCart } from '@/actions/cart.actions';
import { CartInfo } from '@/components/cart/cart-info';
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
      <h2 className="text-2xl">shopping cart</h2>
      {!cart || cart.items?.length === 0 ? (
        <p className="mt-3">cart is empty, go shopping</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-3">
          <CartTable cart={cart} className="lg:col-span-3" />
        </div>
      )}
    </>
  );
}
