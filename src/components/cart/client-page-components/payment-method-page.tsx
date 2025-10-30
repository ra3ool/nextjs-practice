'use client';

import { updateCartPaymentMethod } from '@/actions/cart.actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  DEFAULT_PAYMENT_METHODS,
  PAYMENT_METHODS,
} from '@/constants/cart.constants';
import { routes } from '@/constants/routes.constants';
import { useCart } from '@/contexts/cart.context';
import { isSuccessResponse } from '@/lib/response';
import { paymentMethodSchema } from '@/schemas/cart.schema';
import type { PaymentMethodsType } from '@/types/cart.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon, LoaderIcon } from 'lucide-react';
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

  const form = useForm<PaymentMethodsType>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: cart.paymentMethod || DEFAULT_PAYMENT_METHODS,
    },
  });

  const onSubmit = (paymentMethod: PaymentMethodsType) => {
    startTransition(async () => {
      const result = await updateCartPaymentMethod(cart, paymentMethod);
      if (isSuccessResponse(result)) {
        toast.success(result.message);
        // router.push(routes.dashboard.root);
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
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <RadioGroup
                  defaultValue="option-one"
                  onValueChange={field.onChange}
                  className="flex flex-col space-y-2"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <FormItem key={method} className="flex items-center">
                      <FormControl>
                        <RadioGroupItem
                          value={method}
                          id={method}
                          checked={field.value === method}
                        />
                      </FormControl>
                      <FormLabel htmlFor={method}>{method}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
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
    </>
  );
}

export { ClientPaymentMethodPage };
