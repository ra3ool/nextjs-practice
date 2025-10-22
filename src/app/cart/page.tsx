import { ClientCartPage } from '@/components/cart/client-cart-page';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Cart',
};

function CartPage() {
  return <ClientCartPage />;
}

export { metadata };
export default CartPage;
