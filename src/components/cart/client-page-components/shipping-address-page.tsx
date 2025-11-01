'use client';

import { AddAddressForm } from '@/components/dashboard/add-address-form';
import { AddressesList } from '@/components/dashboard/addresses-list';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { routes } from '@/constants/routes.constants';
import { useCart } from '@/contexts/cart.context';
import type { ShippingAddressType } from '@/types/cart.type';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

function ClientShippingAddressPage({
  addresses,
}: {
  addresses: ShippingAddressType[];
}) {
  const router = useRouter();
  const { cart, setAddresses, setOnFormSubmit } = useCart();

  useEffect(() => {
    if (!cart.items || cart.items.length === 0) {
      router.replace(routes.cart.root);
    }
  }, [cart, router]);

  useEffect(() => {
    setAddresses(addresses);
  }, [addresses, setAddresses]);

  const hasDefaultAddress = useMemo(
    () => addresses.some((address) => address.isDefault),
    [addresses],
  );

  useEffect(() => {
    const submitHandler = () => {
      router.push(routes.cart.paymentMethod);
    };

    setOnFormSubmit(() => {
      if (!hasDefaultAddress) return () => {};

      return submitHandler;
    });

    return () => {
      setOnFormSubmit(() => {});
    };
  }, [hasDefaultAddress]);

  return (
    <>
      <div className="flex gap-8 items-center mb-6">
        <h2 className="text-2xl">Shipping Address</h2>
        {/* TODO make side-sheet close after adding address */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Add New Address</Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start lg:max-w-lg">
            <SheetHeader>
              <SheetTitle>Add Address</SheetTitle>
              <SheetDescription>
                Add your desire address to your address lists
              </SheetDescription>
            </SheetHeader>
            <AddAddressForm className="px-4 w-full" />
          </SheetContent>
        </Sheet>
      </div>

      {addresses.length === 0 ? (
        <p className="mb-6">
          Your address list is empty, try to add new address
        </p>
      ) : (
        <AddressesList addresses={addresses} deletable={false} />
      )}
    </>
  );
}

export { ClientShippingAddressPage };
