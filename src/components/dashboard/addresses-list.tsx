'use client';

import { deleteUserAddress, setDefaultAddress } from '@/actions/user.actions';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ShippingAddressType } from '@/types/cart.type';
import { CheckIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type MouseEventHandler, useTransition } from 'react';
import { toast } from 'sonner';

function AddressesList({
  addresses,
  className,
  deletable = true,
}: {
  addresses: ShippingAddressType[];
  className?: string;
  deletable?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddressClick = (address: ShippingAddressType) => {
    if (isPending) return;
    startTransition(async () => {
      const result = await setDefaultAddress(address);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };
  const handleDeleteAddress = (address: ShippingAddressType) => {
    if (isPending) return;
    startTransition(async () => {
      const result = await deleteUserAddress(address);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {addresses?.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          className={cn(
            'cursor-pointer',
            address.isDefault
              ? 'ring ring-amber-700 dark:ring-amber-200'
              : undefined,
            isPending ? 'opacity-50' : undefined,
          )}
          onClick={() => handleAddressClick(address)}
          {...(deletable && { handleDeleteAddress })}
        />
      ))}
    </div>
  );
}

function AddressCard({
  address,
  className,
  handleDeleteAddress,
  onClick,
}: {
  address: ShippingAddressType;
  className?: string;
  handleDeleteAddress?: Function;
  onClick?: MouseEventHandler;
}) {
  return (
    <Card
      className={cn(
        'p-4 gap-1 flex flex-row justify-between items-center',
        className,
      )}
      onClick={onClick}
    >
      <div>
        {address.address}
        <div>
          {address.country}, {address.city}
        </div>
        {address.postalCode && <>Postal Code: {address.postalCode}</>}
      </div>
      <div className="flex gap-4">
        {address.isDefault && (
          <CheckIcon className="text-amber-700 dark:text-amber-200" />
        )}
        {typeof handleDeleteAddress === 'function' && (
          <TrashIcon
            className="text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAddress(address);
            }}
          />
        )}
      </div>
    </Card>
  );
}

export { AddressCard, AddressesList };
