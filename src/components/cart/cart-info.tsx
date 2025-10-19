'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/cart.context';
import { cn } from '@/lib/utils';
import type { CartType, StepsType } from '@/types/cart.type';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

const CartInfo = memo(({ cart, className }: CartInfoProps) => {
  const { currentStep, setCurrentStep, onFormSubmit } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const step = STEPS_MAP[pathname] || 'cart';
    setCurrentStep(step);
  }, [pathname, setCurrentStep]);

  const getActionButton = useCallback(() => {
    console.log('currentStep :', currentStep);
    switch (currentStep) {
      case 'cart':
        return (
          <Button asChild>
            <Link href="/cart/shipping-address">
              Proceed To Shipping Address
            </Link>
          </Button>
        );
      case 'shipping':
        return (
          <Button onClick={onFormSubmit}>Proceed To Payment Method</Button>
        );
      case 'payment':
        return (
          <Button asChild>
            <Link href="/cart/review">Review Order</Link>
          </Button>
        );
      case 'review':
        return <Button>Place Order</Button>;
      default:
        return null;
    }
  }, [currentStep, onFormSubmit]);

  const subtotalQty = useMemo(
    () => cart.items?.reduce((a, c) => a + c.qty, 0) ?? 0,
    [cart.items],
  );

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center gap-2">
        Subtotal({subtotalQty}):
        <span className="font-bold">${cart.itemsPrice}</span>
      </div>
      <div className="flex items-center gap-2">
        Tax: <span className="font-bold">${cart.taxPrice}</span>
      </div>
      <div className="flex items-center gap-2">
        Total Price: <span className="font-bold">${cart.totalPrice}</span>
      </div>
      {getActionButton()}
    </Card>
  );
});

export { CartInfo };
