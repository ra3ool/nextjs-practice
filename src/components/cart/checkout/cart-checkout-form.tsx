'use client';

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
import { ControllerRenderProps, useForm } from 'react-hook-form';
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
    defaultValues: {
      fullName: 'Rasool',
      country: 'Iran',
      city: 'Tehran',
      address: 'Diamond street',
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: CartCheckoutType) => {
    console.log('values :', values);
  };

  return (
    <div className={cn(className)}>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <h3>please enter an address to ship to</h3>

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
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter fullName"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3 w-full sm:flex-row">
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
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
