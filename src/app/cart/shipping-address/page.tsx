import { getUserAddresses } from '@/actions/user.actions';
import { ClientShippingAddressPage } from '@/components/cart/client-shipping-address-page';
import { isErrorResponse } from '@/lib/response';
import type { ShippingAddressType } from '@/types/cart.type';
import type { Metadata } from 'next';
import { toast } from 'sonner';

const metadata: Metadata = {
  title: 'Shipping Address',
};

async function ShippingAddressPage() {
  const result = await getUserAddresses();

  if (isErrorResponse(result)) {
    toast.error(result.message);
  }
  const addresses = result.data as ShippingAddressType[];

  return <ClientShippingAddressPage addresses={addresses} />;
}

export { metadata };
export default ShippingAddressPage;
