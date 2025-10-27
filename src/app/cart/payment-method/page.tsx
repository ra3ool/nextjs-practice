import { getCurrentUser } from '@/actions/user.actions';
import { ClientPaymentMethodPage } from '@/components/cart/client-page-components/payment-method-page';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Payment Method',
};

async function PaymentMethodPage() {
  const user = await getCurrentUser();

  return <ClientPaymentMethodPage />;
}

export { metadata };
export default PaymentMethodPage;
