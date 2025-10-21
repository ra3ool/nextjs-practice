'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { routes } from '@/constants/routes.constants';
import { useCart } from '@/contexts/cart.context';
import { cn } from '@/lib/utils';
import type { CartType, StepsType } from '@/types/cart.type';
import { formatPrice } from '@/utils/format-price';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useMemo } from 'react';

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

  //TODO adding skeleton loading later form better ux
  // if (!cart || !currentStep) {
  //   return (
  //     <Card className={cn('p-4 select-none', className)}>
  //       <div className="animate-pulse flex flex-col gap-8">
  //         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  //         <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  //         <div className="h-4 bg-gray-200 rounded w-2/3"></div>
  //         <div className="h-9 bg-gray-200 rounded-md"></div>
  //       </div>
  //     </Card>
  //   );
  // }

  const cartContent = useMemo(
    () => (
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
    ),
    [
      subtotalQty,
      cart.itemsPrice,
      cart.taxPrice,
      cart.totalPrice,
      currentStep,
      hasDefaultAddress,
      onFormSubmit,
      className,
    ],
  );

  return cartContent;
});

const ActionButton = memo(
  ({
    step,
    hasDefault,
    onFormSubmit,
  }: {
    step: StepsType;
    hasDefault: boolean;
    onFormSubmit?: () => void;
  }) => {
    const router = useRouter();
    const goToRoute = useCallback(
      (path: string) => router.push(path),
      [router],
    );
    switch (step) {
      case 'cart':
        return (
          <Button onClick={() => goToRoute(routes.cart.shippingAddress)}>
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
          <Button onClick={() => goToRoute(routes.cart.review)}>
            Review Order
          </Button>
        );
      case 'review':
        return <Button>Place Order</Button>;
      default:
        return <Button disabled>Loading...</Button>;
    }
  },
);

export { CartInfo };
