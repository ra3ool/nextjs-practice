import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentMethodSchema,
  shippingAddressSchema,
} from '@/schemas/cart.schema';
import type { Session } from 'next-auth';
import { z } from 'zod';
import { Product } from './product.type';

export type InsertCartType = z.infer<typeof insertCartSchema>;
export type CartType = InsertCartType & {
  id: number;
  createdAt: string;
  updatedAt: string;
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
  addresses: CartContextType['addresses'];
};

export type PaymentMethodsType = z.infer<typeof paymentMethodSchema>;

//should move to order type file
export type InsertOrderType = z.infer<typeof insertOrderSchema>;
export type OrderType = InsertOrderType & {
  id: number;
  createdAt: string;
  paidAt: string | null;
  deliveredAt: string | null;
  OrderItems: OrderItemType[];
  user: { name: string; email: string };
};
export type OrderItemType = z.infer<typeof insertOrderItemSchema> & {
  product?: Product;
};
