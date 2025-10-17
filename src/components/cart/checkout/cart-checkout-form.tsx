'use client';

import { updateUserAddress } from '@/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { cartCheckoutSchema } from '@/schemas/cart.schema';
import { CartCheckoutType } from '@/types/cart.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon, LoaderIcon } from 'lucide-react';
import { useTransition } from 'react';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

function CartCheckoutForm({
  address,
  className,
}: {
  address?: CartCheckoutType;
  className?: string;
}) {
  const form = useForm<CartCheckoutType>({
    resolver: zodResolver(cartCheckoutSchema),
    defaultValues: address || {
      fullName: 'Rasool',
      phoneNumber: '09123456789',
      country: 'Iran',
      city: 'Tehran',
      address: 'Diamond street',
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof cartCheckoutSchema>> = (
    values: CartCheckoutType,
  ) => {
    startTransition(async () => {
      const result = await updateUserAddress(values);
      // router.push('/payment-method')
    });
  };

  return (
    <div className={cn(className)}>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <h3>please enter an address to ship to</h3>

          <div className="flex flex-col gap-3 w-full sm:flex-row items-start">
            <FormField
              control={form.control}
              name="fullName"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof cartCheckoutSchema>,
                  'fullName'
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter fullName"
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
                  z.infer<typeof cartCheckoutSchema>,
                  'phoneNumber'
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter phoneNumber"
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
            {/* TODO change country input to select box  */}
            <FormField
              control={form.control}
              name="country"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof cartCheckoutSchema>,
                  'country'
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter country"
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
                  z.infer<typeof cartCheckoutSchema>,
                  'city'
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter city"
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
                z.infer<typeof cartCheckoutSchema>,
                'address'
              >;
            }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter address"
                    disabled={isPending}
                    suppressHydrationWarning
                    {...field}
                  />
                </FormControl>
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
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}

export { CartCheckoutForm };
