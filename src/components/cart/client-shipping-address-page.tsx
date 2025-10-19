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
import { useCart } from '@/contexts/cart.context';
import type { ShippingAddressType } from '@/types/cart.type';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

function ClientShippingAddressPage({
  addresses,
}: {
  addresses: ShippingAddressType[];
}) {
  const { cart } = useCart();

  if (!cart.sessionCartId || cart.items?.length === 0) {
    redirect('/cart');
  }

  return (
    <>
      <div className="flex gap-8">
        <h2 className="text-2xl mb-6">Shipping Address</h2>
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
          your address list is empty, try to add new address
        </p>
      ) : (
        <AddressesList
          addresses={addresses as ShippingAddressType[]}
          deletable={false}
        />
      )}
    </>
  );
}

export { ClientShippingAddressPage };
