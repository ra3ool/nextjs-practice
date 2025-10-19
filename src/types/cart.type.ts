import {
  cartItemSchema,
  insertCartSchema,
  shippingAddressSchema,
} from '@/schemas/cart.schema';
import type { Session } from 'next-auth';
import { z } from 'zod';

export type InsertCartType = z.infer<typeof insertCartSchema>;
export type CartType = InsertCartType & {
  createdAt: Date | string;
  updatedAt: Date | string;
};
export type CartItemType = z.infer<typeof cartItemSchema>;

export type ShippingAddressType = z.infer<typeof shippingAddressSchema>;

export type StepsType = '' | 'cart' | 'shipping' | 'payment' | 'review'; //empty string used for loading state
export interface CartContextType {
  session: Session | null;
  cart: CartType;
  currentStep: StepsType;
  setCurrentStep: (step: StepsType) => void;
  addresses: ShippingAddressType[];
  setAddresses: (addresses: ShippingAddressType[]) => void;
  onFormSubmit?: () => void;
  setOnFormSubmit: (handler: () => void) => void;
}
export interface CartProviderType {
  children: React.ReactNode;
  session: CartContextType['session'];
  cart: CartContextType['cart'];
}
