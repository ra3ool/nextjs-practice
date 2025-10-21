import { ClientPaymentMethodPage } from '@/components/cart/client-payment-method-page';
import { authOptions } from '@/lib/auth';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'Payment Method',
};

export default async function PaymentMethodPage() {
  const session = await getServerSession(authOptions);
  const userId = +session!.user!.id;

  return <ClientPaymentMethodPage />;
}
