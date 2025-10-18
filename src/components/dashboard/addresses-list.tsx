'use client';

import { setDefaultAddress } from '@/actions/user.actions';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ShippingAddressType } from '@/types/cart.type';
import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type MouseEventHandler, useTransition } from 'react';
import { toast } from 'sonner';

function AddressesList({
  addresses,
  className,
}: {
  addresses: ShippingAddressType[];
  className?: string;
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

  return (
    <div className={cn('space-y-4', className)}>
      {addresses?.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          className={cn(
            'cursor-pointer',
            address.isDefault ? 'border border-amber-200' : undefined,
          )}
          onClick={() => handleAddressClick(address)}
        />
      ))}
    </div>
  );
}

function AddressCard({
  address,
  className,
  onClick,
}: {
  address: ShippingAddressType;
  className?: string;
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
      {address.isDefault && <CheckIcon />}
    </Card>
  );
}

export { AddressCard, AddressesList };
