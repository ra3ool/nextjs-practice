import { getMyCart } from '@/actions/cart.actions';
import { CartInfo } from '@/components/cart/cart-info';
import { ShippingAddressForm } from '@/components/cart/shipping-address/shipping-address-form';
import { CartType } from '@/types/cart.type';
import { serializeCart } from '@/utils/serialize-cart';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

export default async function ShippingAddressPage() {
  const cart = serializeCart((await getMyCart()) as CartType);
  if (!cart.sessionCartId || cart.items?.length === 0) redirect('/cart');

  const address = undefined;

  return (
    <>
      <h2 className="text-2xl">Shipping Address</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-3">
        <ShippingAddressForm address={address} className="lg:col-span-3" />
        <CartInfo cart={cart} className="h-fit" />
      </div>
    </>
  );
}
