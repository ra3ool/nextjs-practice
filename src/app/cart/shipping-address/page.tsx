import { getUserAddresses } from '@/actions/user.actions';
import { ClientShippingAddressPage } from '@/components/cart/client-page-components/shipping-address-page';
import { isErrorResponse } from '@/lib/response';
import type { ShippingAddressType } from '@/types/cart.type';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Shipping Address',
};

async function ShippingAddressPage() {
  const result = await getUserAddresses();

  if (isErrorResponse(result)) return <p>{result.message}</p>;

  const addresses = result.data as ShippingAddressType[];

  return <ClientShippingAddressPage addresses={addresses} />;
}

export { metadata };
export default ShippingAddressPage;
