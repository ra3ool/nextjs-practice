'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/cart.context';
import { cn } from '@/lib/utils';
import type { CartType, StepsType } from '@/types/cart.type';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo } from 'react';

interface CartInfoProps {
  cart: CartType;
  className?: string;
}

const STEPS_MAP: Record<string, StepsType> = {
  '/cart': 'cart',
  '/cart/shipping-address': 'shipping',
  '/cart/payment-method': 'payment',
  '/cart/review': 'review',
};

//FIXME prevent re-render on address changes!
const CartInfo = memo(({ cart, className }: CartInfoProps) => {
  const { currentStep, setCurrentStep, onFormSubmit, addresses } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const step = STEPS_MAP[pathname] || 'cart';
    setCurrentStep(step);
  }, [pathname, setCurrentStep]);

  const hasDefaultAddress = useMemo(
    () => addresses.some((address) => address.isDefault),
    [addresses],
  );

  const getActionButton = useCallback(() => {
    switch (currentStep) {
      case 'cart':
        return (
          <Button onClick={() => router.push('/cart/shipping-address')}>
            Proceed To Shipping Address
          </Button>
        );
      case 'shipping':
        return (
          <Button disabled={!hasDefaultAddress} onClick={onFormSubmit}>
            {!hasDefaultAddress
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
  }, [currentStep, onFormSubmit, hasDefaultAddress, router]);

  const subtotalQty = useMemo(
    () => cart.items?.reduce((a, c) => a + c.qty, 0) ?? 0,
    [cart.items],
  );

  return (
    <Card className={cn('p-4 select-none', className)}>
      <div className="flex items-center gap-2">
        Subtotal({subtotalQty}):
        <span className="font-bold">${cart.itemsPrice || 0}</span>
      </div>
      <div className="flex items-center gap-2">
        Tax: <span className="font-bold">${cart.taxPrice || 0}</span>
      </div>
      <div className="flex items-center gap-2">
        Total Price: <span className="font-bold">${cart.totalPrice || 0}</span>
      </div>
      {getActionButton()}
    </Card>
  );
});

CartInfo.displayName = 'CartInfo';

export { CartInfo };
