import { ClientPlaceOrderPage } from '@/components/cart/client-page-components/place-order-page';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Place Order',
};

async function PlaceOrderPage() {
  return <ClientPlaceOrderPage />;
}

export { metadata };
export default PlaceOrderPage;
