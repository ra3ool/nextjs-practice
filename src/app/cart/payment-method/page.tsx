import { ClientPaymentMethodPage } from '@/components/cart/client-page-components/payment-method-page';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Payment Method',
};

async function PaymentMethodPage() {
  return <ClientPaymentMethodPage />;
}

export { metadata };
export default PaymentMethodPage;
