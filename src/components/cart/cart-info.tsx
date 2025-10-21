'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/cart.context';
import { cn } from '@/lib/utils';
import type { CartType, StepsType } from '@/types/cart.type';
import { formatPrice } from '@/utils/format-price';
import { useRouter } from 'next/navigation';
import { memo, useMemo } from 'react';

interface CartInfoProps {
  cart: CartType;
  className?: string;
}

//FIXME prevent re-render on address changes!
const CartInfo = memo(({ cart, className }: CartInfoProps) => {
  const { currentStep, onFormSubmit, addresses } = useCart();

  const hasDefaultAddress = useMemo(
    () => addresses.some((address) => address.isDefault),
    [addresses],
  );

  const subtotalQty = useMemo(
    () => cart.items?.reduce((a, c) => a + c.qty, 0) ?? 0,
    [cart.items],
  );

  return (
    <Card className={cn('p-4 select-none', className)}>
      <div className="flex items-center gap-2">
        Subtotal({subtotalQty}):
        <span className="font-bold">{formatPrice(cart.itemsPrice)}</span>
      </div>
      <div className="flex items-center gap-2">
        Tax: <span className="font-bold">{formatPrice(cart.taxPrice)}</span>
      </div>
      <div className="flex items-center gap-2">
        Total Price:{' '}
        <span className="font-bold">{formatPrice(cart.totalPrice)}</span>
      </div>
      <ActionButton
        step={currentStep}
        hasDefault={hasDefaultAddress}
        onFormSubmit={onFormSubmit}
      />
    </Card>
  );
});

function ActionButton({
  step,
  hasDefault,
  onFormSubmit,
}: {
  step: StepsType;
  hasDefault: boolean;
  onFormSubmit?: () => void;
}) {
  const router = useRouter();
  switch (step) {
    case 'cart':
      return (
        <Button onClick={() => router.push('/cart/shipping-address')}>
          Proceed To Shipping Address
        </Button>
      );
    case 'shipping':
      return (
        <Button disabled={!hasDefault} onClick={onFormSubmit}>
          {!hasDefault
            ? 'Please select an address'
            : 'Proceed To Payment Method'}
        </Button>
      );
    case 'payment':
      return (
        <Button onClick={() => router.push('/cart/review')}>
          Review Order
        </Button>
      );
    case 'review':
      return <Button>Place Order</Button>;
    default:
      return <Button disabled>Loading...</Button>;
  }
}

export { CartInfo };
