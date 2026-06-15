'use client';

import { deleteUserAddress, setDefaultAddress } from '@/actions/user.actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isSuccessResponse } from '@/lib/response';
import { cn } from '@/lib/utils';
import type { ShippingAddressType } from '@/types/cart.type';
import {
  CheckIcon,
  EditIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from 'lucide-react';
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
    if (isPending || address.isDefault) return;
    startTransition(async () => {
      const result = await setDefaultAddress(address);

      if (isSuccessResponse(result)) {
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

      if (isSuccessResponse(result)) {
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
            address.isDefault && 'ring ring-amber-700 dark:ring-amber-200',
            isPending && 'opacity-50',
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
  showDefaultAddressCheckIcon = true,
}: {
  address: ShippingAddressType;
  className?: string;
  handleDeleteAddress?: (address: ShippingAddressType) => void;
  onClick?: MouseEventHandler;
  showDefaultAddressCheckIcon?: boolean;
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
      <div className="flex gap-4 items-center">
        {address.isDefault && showDefaultAddressCheckIcon && (
          <CheckIcon className="text-amber-700 dark:text-amber-200" />
        )}
        {typeof handleDeleteAddress === 'function' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <EllipsisVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO complete edit address
                  console.log('edit address');
                }}
              >
                <EditIcon />
                Edit this Address
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-red-400 focus:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAddress(address);
                }}
              >
                <TrashIcon className="text-red-400" />
                Delete this Address
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Card>
  );
}

export { AddressCard, AddressesList };
