'use client';

import { updateUserAddress } from '@/actions/user.actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { isSuccessResponse } from '@/lib/response';
import { cn } from '@/lib/utils';
import { shippingAddressSchema } from '@/schemas/cart.schema';
import type { ShippingAddressType } from '@/types/cart.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon, LoaderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useTransition } from 'react';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

function AddAddressForm({
  addresses,
  addressForEdit,
  className,
}: {
  addresses: ShippingAddressType[];
  addressForEdit?: ShippingAddressType;
  className?: string;
}) {
  const form = useForm<ShippingAddressType>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      phoneNumber: addressForEdit?.phoneNumber || '',
      country: addressForEdit?.country || '',
      city: addressForEdit?.city || '',
      address: addressForEdit?.address || '',
      postalCode: addressForEdit?.postalCode || '',
      isDefault: addressForEdit?.isDefault || false,
      // lat: undefined,
      // lng: undefined,
    },
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const hasDefaultAddress = useMemo(
    () => addresses.some((address) => address.isDefault),
    [addresses],
  );

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = (
    address: ShippingAddressType,
  ) => {
    if (!hasDefaultAddress) address.isDefault = true;

    startTransition(async () => {
      const result = await updateUserAddress(address);
      if (isSuccessResponse(result)) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className={cn(className)}>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="id"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof shippingAddressSchema>,
                'id'
              >;
            }) => <Input type="hidden" suppressHydrationWarning {...field} />}
          />

          <div className="flex flex-col gap-3 w-full sm:flex-row items-start">
            {/* TODO change country input to select box  */}
            <FormField
              control={form.control}
              name="country"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  'country'
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Country"
                      disabled={isPending}
                      suppressHydrationWarning
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  'city'
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter City"
                      disabled={isPending}
                      suppressHydrationWarning
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-3 w-full sm:flex-row items-start">
            <FormField
              control={form.control}
              name="postalCode"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  'postalCode'
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter PostalCode"
                      disabled={isPending}
                      suppressHydrationWarning
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  'phoneNumber'
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter PhoneNumber"
                      disabled={isPending}
                      suppressHydrationWarning
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* TODO change address input to textarea  */}
          <FormField
            control={form.control}
            name="address"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof shippingAddressSchema>,
                'address'
              >;
            }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Street Name and ..."
                    disabled={isPending}
                    suppressHydrationWarning
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*
          <div className="flex flex-col gap-3 w-full sm:flex-row items-start">
            <FormField
              control={form.control}
              name="lat"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  'lat'
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Latitude"
                      disabled={isPending}
                      suppressHydrationWarning
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lng"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  'lng'
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Longitude"
                      disabled={isPending}
                      suppressHydrationWarning
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          */}

          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={!hasDefaultAddress ? true : field.value}
                    onCheckedChange={field.onChange}
                    disabled={!hasDefaultAddress || isPending}
                    suppressHydrationWarning
                    className="w-5 h-5"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Make default address</FormLabel>
                  <FormDescription>
                    Set this as your default shipping address
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} suppressHydrationWarning>
            {isPending ? (
              <LoaderIcon className="animate-spin w-4 h-4" />
            ) : (
              <ArrowRightIcon className="w-4 h-4" />
            )}
            Save Address
          </Button>
        </form>
      </Form>
    </div>
  );
}

export { AddAddressForm };
