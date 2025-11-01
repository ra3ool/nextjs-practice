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
import { isErrorResponse } from '@/lib/response';
import type { ShippingAddressType } from '@/types/cart.type';
import type { Metadata } from 'next';
import { toast } from 'sonner';

const metadata: Metadata = {
  title: 'Addresses',
};

async function UserAddressesPage() {
  const addressResult = await getUserAddresses();

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
            <AddAddressForm addresses={addresses} className="px-4 w-full" />
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
