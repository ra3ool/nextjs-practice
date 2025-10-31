'use client';

import { updateCartPaymentMethod } from '@/actions/cart.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  DEFAULT_PAYMENT_METHODS,
  PAYMENT_METHODS,
} from '@/constants/cart.constants';
import { routes } from '@/constants/routes.constants';
import { useCart } from '@/contexts/cart.context';
import { isSuccessResponse } from '@/lib/response';
import { cn } from '@/lib/utils';
import { paymentMethodSchema } from '@/schemas/cart.schema';
import type { PaymentMethodsType } from '@/types/cart.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

function ClientPaymentMethodPage() {
  const { cart, addresses, setOnFormSubmit } = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  //FIXME go with a better way, prevent router.replace when user has default address
  useEffect(() => {
    if (!(addresses && addresses.some((address) => address.isDefault))) {
      router.replace(routes.cart.shippingAddress);
    }
  }, [addresses, router]);

  const form = useForm({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: cart.paymentMethod || DEFAULT_PAYMENT_METHODS,
      discountCode: '',
    },
  });

  const onSubmit = (data: PaymentMethodsType) => {
    startTransition(async () => {
      const result = await updateCartPaymentMethod(cart, data);
      if (isSuccessResponse(result)) {
        toast.success(result.message);
        router.push(routes.cart.review);
      } else {
        toast.error(result.message);
      }
    });
  };

  useEffect(() => {
    const submitHandler = () => {
      form.handleSubmit(onSubmit)();
    };

    setOnFormSubmit(() => submitHandler);

    return () => {
      setOnFormSubmit(() => {});
    };
  }, []);

  return (
    <>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Card className={cn('overflow-hidden', isPending && 'opacity-50')}>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <RadioGroup
                      name="paymentMethod"
                      onValueChange={field.onChange}
                      className="flex flex-col gap-0"
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <FormItem
                          key={method.name}
                          className="flex items-center border-b gap-3"
                        >
                          <FormControl>
                            <RadioGroupItem
                              disabled={isPending}
                              value={method.name}
                              id={method.name}
                              checked={field.value === method.name}
                              className={cn(
                                'w-6 h-6',
                                field.value === method.name && 'border-primary',
                              )}
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={method.name}
                            className="flex flex-col items-start grow py-5"
                          >
                            {method.name}
                            <div className="text-gray-500 dark:text-gray-400">
                              {method.description}
                            </div>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex">
                <FormField
                  control={form.control}
                  name="discountCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter Code"
                          disabled={isPending}
                          className="rounded-r-none max-w-3xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="rounded-l-none"
                  type="button"
                  onClick={() => toast.warning('Code not exist')}
                >
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
}

export { ClientPaymentMethodPage };
