import { CartTable } from './cart-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cart',
};

export default function CartPage() {
  return (
    <>
      <CartTable />
    </>
  );
}
