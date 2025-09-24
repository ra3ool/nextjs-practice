import { cartItem, insertCartSchema } from '@/schemas/cart.schema';
import z from 'zod';

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItem>;
