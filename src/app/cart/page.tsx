import { ClientCartPage } from '@/components/cart/client-cart-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cart',
};

export default async function CartPage() {
  return <ClientCartPage />;
}
