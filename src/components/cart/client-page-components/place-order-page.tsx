'use client';

import { createOrder } from '@/actions/order.actions';
import { CartTable } from '@/components/cart/cart-table';
import { AddressCard } from '@/components/dashboard/addresses-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { routes } from '@/constants/routes.constants';
import { useCart } from '@/contexts/cart.context';
import { isSuccessResponse } from '@/lib/response';
import { cn } from '@/lib/utils';
import type { ShippingAddressType } from '@/types/cart.type';
import { useRouter } from 'next/navigation';
import { MouseEventHandler, useEffect, useTransition } from 'react';
import { toast } from 'sonner';

function ClientPlaceOrderPage() {
  const router = useRouter();
  const { cart, addresses, setOnFormSubmit } = useCart();
  const defaultAddress = addresses.find((address) => address.isDefault);
  const [isPending, startTransition] = useTransition();

  const goToStep = (link: string) => {
    if (isPending) return;
    router.push(link);
  };

  useEffect(() => {
    if (!cart.items || cart.items.length === 0) {
      router.replace(routes.cart.root);
    } else if (!defaultAddress) {
      router.replace(routes.cart.shippingAddress);
    }
  }, [cart, router, defaultAddress]);

  useEffect(() => {
    const orderAddress = {
      country: defaultAddress?.country,
      city: defaultAddress?.city,
      address: defaultAddress?.address,
      phoneNumber: defaultAddress?.phoneNumber,
      postalCode: defaultAddress?.postalCode,
    };

    const submitHandler = () =>
      startTransition(async () => {
        const payload = {
          shippingAddress: JSON.stringify(orderAddress),
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          taxPrice: cart.taxPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice,
        };
        const result = await createOrder(cart, payload);

        if (isSuccessResponse(result)) {
          toast.success(result.message);
          router.push(`${routes.dashboard.orders.single}/${result.data}`);
        } else {
          toast.error(result.message);
        }
      });

    setOnFormSubmit(() => submitHandler);

    return () => {
      setOnFormSubmit(() => {});
    };
  }, [cart, defaultAddress, router, setOnFormSubmit]);

  return (
    <div className={cn('flex flex-col gap-5', isPending && 'opacity-50')}>
      <CardWrapper
        title="Cart Items"
        onEditClick={() => goToStep(routes.cart.root)}
      >
        <CartTable cart={cart} showOnlyItemsDetail linkToProduct={false} />
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
