'use client';

import { CartTable } from '@/components/cart/cart-table';
import { useCart } from '@/contexts/cart.context';

function ClientCartPage() {
  const { cart } = useCart();

  return (
    <>
      {!cart.items || cart.items?.length === 0 ? (
        <p className="mt-3">cart is empty, go shopping</p>
      ) : (
        <>
          <h2 className="text-2xl">Shopping Cart</h2>
          <CartTable cart={cart} />
        </>
      )}
    </>
  );
}

export { ClientCartPage };
