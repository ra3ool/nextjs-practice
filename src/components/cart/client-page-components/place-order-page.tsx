'use client';

import { CartTable } from '@/components/cart/cart-table';
import { AddressCard } from '@/components/dashboard/addresses-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { routes } from '@/constants/routes.constants';
import { useCart } from '@/contexts/cart.context';
import type { ShippingAddressType } from '@/types/cart.type';
import { useRouter } from 'next/navigation';
import { MouseEventHandler, useEffect } from 'react';

function ClientPlaceOrderPage() {
  const router = useRouter();
  const { cart, addresses } = useCart();
  const defaultAddress = addresses.find((address) => address.isDefault);
  const goToStep = (link: string) => router.push(link);

  useEffect(() => {
    if (!cart.items || cart.items.length === 0) {
      router.replace(routes.cart.root);
    } else if (!addresses || addresses.length === 0) {
      router.replace(routes.cart.shippingAddress);
    }
  }, [cart, router]);

  return (
    <div className="flex flex-col gap-5">
      <CardWrapper
        title="Cart Items"
        onEditClick={() => goToStep(routes.cart.root)}
      >
        <CartTable cart={cart} showOnlyItemsDetail />
      </CardWrapper>

      <CardWrapper
        title="Delivery Address"
        onEditClick={() => goToStep(routes.cart.shippingAddress)}
      >
        <AddressCard
          address={defaultAddress as ShippingAddressType}
          className="border-none shadow-none"
          showDefaultAddressCheckIcon={false}
        />
      </CardWrapper>

      <CardWrapper
        title="Payment Method"
        onEditClick={() => goToStep(routes.cart.paymentMethod)}
      >
        <div>{cart.paymentMethod}</div>
      </CardWrapper>
    </div>
  );
}

function CardWrapper({
  title,
  onEditClick,
  children,
}: {
  title: string;
  onEditClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <h3 className="text-xl">{title}</h3>
        {children}
        <Button variant="outline" className="block" onClick={onEditClick}>
          Edit
        </Button>
      </CardContent>
    </Card>
  );
}

export { ClientPlaceOrderPage };
