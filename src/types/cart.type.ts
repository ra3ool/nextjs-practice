import {
  cartItemSchema,
  insertCartSchema,
  shippingAddressSchema,
} from '@/schemas/cart.schema';
import { z } from 'zod';

export type CartType = z.infer<typeof insertCartSchema>;
export type CartItemType = z.infer<typeof cartItemSchema>;

export type ShippingAddressType = z.infer<typeof shippingAddressSchema>;
