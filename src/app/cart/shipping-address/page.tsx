import { getMyCart } from '@/actions/cart.actions';
import { getUserAddresses } from '@/actions/user.actions';
import { CartInfo } from '@/components/cart/cart-info';
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
import { authOptions } from '@/lib/auth';
import type { CartType, ShippingAddressType } from '@/types/cart.type';
import { serializeCart } from '@/utils/serialize-cart';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

export default async function ShippingAddressPage() {
  const [cart, session] = await Promise.all([
    getMyCart(),
    getServerSession(authOptions),
  ]);
  const serializedCart = serializeCart(cart as CartType);

  if (!serializedCart.sessionCartId || serializedCart.items?.length === 0) {
    redirect('/cart');
  }

  const userId = +session!.user!.id;
  const addresses = await getUserAddresses(userId);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
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
        </div>
        <CartInfo cart={serializedCart} className="h-fit sticky top-20" />
      </div>
    </>
  );
}
