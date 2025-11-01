import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentMethodSchema,
  shippingAddressSchema,
} from '@/schemas/cart.schema';
import { User } from '@prisma/client';
import type { Session } from 'next-auth';
import { z } from 'zod';

export type InsertCartType = z.infer<typeof insertCartSchema>;
export type CartType = InsertCartType & {
  createdAt: Date | string;
  updatedAt: Date | string;
};
export type CartItemType = z.infer<typeof cartItemSchema>;

export type ShippingAddressType = z.infer<typeof shippingAddressSchema>;

export type StepsType = 'loading' | 'cart' | 'shipping' | 'payment' | 'review';
export type CartContextType = {
  session: Session | null;
  cart: CartType;
  currentStep: StepsType;
  setCurrentStep: (step: StepsType) => void;
  addresses: ShippingAddressType[];
  setAddresses: (addresses: ShippingAddressType[]) => void;
  onFormSubmit?: () => void;
  setOnFormSubmit: (handler: () => void) => void;
};
export type CartProviderType = {
  children: React.ReactNode;
  session: CartContextType['session'];
  cart: CartContextType['cart'];
};

export type PaymentMethodsType = z.infer<typeof paymentMethodSchema>;

export type OrderType = z.infer<typeof insertOrderSchema> & {
  id: Number;
  createdAt: Date | string;
  isPaid: Boolean;
  paidAt: Date | string | null;
  deliveredAt: Date | string | null;
  orderItems: OrderItemType[];
  user: User
};
export type OrderItemType = z.infer<typeof insertOrderItemSchema>;
