import { getMyCart } from '@/actions/cart.actions';
import { getUserAddresses } from '@/actions/user.actions';
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
import { isErrorResponse } from '@/lib/response';
import type { CartType, ShippingAddressType } from '@/types/cart.type';
import { serializeCart } from '@/utils/serialize-cart';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

const metadata: Metadata = {
  title: 'Addresses',
};

async function UserAddressesPage() {
  const [cart, addressResult] = await Promise.all([
    getMyCart(),
    getUserAddresses(),
  ]);
  const serializedCart = serializeCart(cart as CartType);

  if (!serializedCart.sessionCartId || serializedCart.items?.length === 0) {
    redirect(routes.cart.root);
  }

  if (isErrorResponse(addressResult)) {
    toast.error(addressResult.message || 'Error in get user addresses');
  }
  const addresses = addressResult.data as ShippingAddressType[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-8">
        <h2 className="text-xl font-bold">Your saved addresses</h2>
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
        <AddressesList addresses={addresses} />
      )}
    </div>
  );
}

export { metadata };
export default UserAddressesPage;
