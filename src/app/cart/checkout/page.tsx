import { getMyCart } from '@/actions/cart.actions';
import { CartInfo } from '@/components/cart/cart-info';
import { CartCheckoutForm } from '@/components/cart/checkout/cart-checkout-form';
import { CartType } from '@/types/cart.type';
import { serializeCart } from '@/utils/serialize-cart';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function CheckoutPage() {
  const cart = serializeCart((await getMyCart()) as CartType);
  if (!cart.sessionCartId || cart.items?.length === 0) redirect('/cart');

  return (
    <>
      <h2 className="text-2xl">checkout cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-3">
        <CartInfo cart={cart} className="h-fit" />
      </div>
    </>
  );
}
