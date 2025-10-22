import { ClientPaymentMethodPage } from '@/components/cart/client-payment-method-page';
import { authOptions } from '@/lib/auth';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

const metadata: Metadata = {
  title: 'Payment Method',
};

async function PaymentMethodPage() {
  const session = await getServerSession(authOptions);
  const userId = +session!.user!.id;

  return <ClientPaymentMethodPage />;
}

export { metadata };
export default PaymentMethodPage;
