'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { freeShippingLimit } from '@/constants/cart.constants';
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

  const addressListLength = useMemo(() => addresses.length ?? 0, [addresses]);

  const hasEmptyCart = useMemo(
    () => !cart.items || cart.items.length === 0,
    [cart],
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
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span>Subtotal ({subtotalQty} items):</span>
            <span className="font-bold">{formatPrice(cart.itemsPrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax:</span>
            <span className="font-bold">{formatPrice(cart.taxPrice)}</span>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span>Shipping Price:</span>
              <span className="font-bold">
                {formatPrice(cart.shippingPrice)}
              </span>
            </div>
            <div className="text-green-600 text-xs">
              free shipping on over ${freeShippingLimit} shopping
            </div>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <span className="font-semibold">Total Price:</span>
            <span className="font-bold text-lg">
              {formatPrice(cart.totalPrice)}
            </span>
          </div>
        </div>

        <ActionButton
          currentStep={currentStep}
          hasEmptyCart={hasEmptyCart}
          addressListLength={addressListLength}
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
      hasEmptyCart,
      addressListLength,
      onFormSubmit,
      className,
    ],
  );

  return cartContent;
});

const ActionButton = memo(
  ({
    currentStep,
    hasEmptyCart,
    addressListLength,
    onFormSubmit,
  }: {
    currentStep: StepsType;
    hasEmptyCart: boolean;
    addressListLength: number;
    onFormSubmit?: () => void;
  }) => {
    const router = useRouter();
    const goToRoute = useCallback(
      (path: string) => router.push(path),
      [router],
    );

    switch (currentStep) {
      case 'cart':
        return (
          <Button
            disabled={hasEmptyCart}
            onClick={() => goToRoute(routes.cart.shippingAddress)}
          >
            {hasEmptyCart
              ? 'Please add some product'
              : 'Proceed To Shipping Address'}
          </Button>
        );
      case 'shipping':
        return (
          <Button disabled={addressListLength === 0} onClick={onFormSubmit}>
            {addressListLength === 0
              ? 'Please add an address'
              : 'Proceed To Payment Method'}
          </Button>
        );
      case 'payment':
        return <Button onClick={onFormSubmit}>Review And Place Order</Button>;
      case 'review':
        return <Button>Place Order</Button>;
      default:
        return <Button disabled>Loading...</Button>;
    }
  },
);

export { CartInfo };
