import { getUserAddresses } from '@/actions/user.actions';
import { ClientShippingAddressPage } from '@/components/cart/client-shipping-address-page';
import { authOptions } from '@/lib/auth';
import type { ShippingAddressType } from '@/types/cart.type';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

const metadata: Metadata = {
  title: 'Shipping Address',
};

async function ShippingAddressPage() {
  const session = await getServerSession(authOptions);
  const userId = +session!.user!.id;

  const addresses = await getUserAddresses(userId);

  return (
    <ClientShippingAddressPage addresses={addresses as ShippingAddressType[]} />
  );
}

export { metadata };
export default ShippingAddressPage;
