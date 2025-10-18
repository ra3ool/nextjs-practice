import { getMyCart } from '@/actions/cart.actions';
import { getUserAddresses } from '@/actions/user.actions';
import { CartInfo } from '@/components/cart/cart-info';
import { AddressesList } from '@/components/dashboard/addresses-list';
import { authOptions } from '@/lib/auth';
import type { CartType, ShippingAddressType } from '@/types/cart.type';
import { serializeCart } from '@/utils/serialize-cart';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

export default async function ShippingAddressPage() {
  const [cart, session] = await Promise.all([
    getMyCart(),
    getServerSession(authOptions),
  ]);
  const serializedCart = serializeCart(cart as CartType);

  if (!serializedCart.sessionCartId || serializedCart.items?.length === 0) {
    redirect('/cart');
  }

  const userId = +session!.user!.id;
  const addresses = await getUserAddresses(userId);

  return (
    <>
      <h2 className="text-2xl mb-6">Shipping Address</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <AddressesList
          addresses={addresses as ShippingAddressType[]}
          className="lg:col-span-3"
        />
        <CartInfo cart={serializedCart} className="h-fit sticky top-20" />
      </div>
    </>
  );
}
