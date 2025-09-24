import z from 'zod';
import { insertProductSchema } from './product.schema';

export const cartItem = z.object({
  productId: z.number(),
  name: insertProductSchema.shape.name,
  slug: insertProductSchema.shape.slug,
  qty: z.number().int().nonnegative('Quantity must be positive number'),
  image: z.string(),
  price: insertProductSchema.shape.price,
});

export const insertCartSchema = z.object({
  items: z.array(cartItem),
  itemPrice: insertProductSchema.shape.price,
  totalPrice: insertProductSchema.shape.price,
  shippingPrice: insertProductSchema.shape.price,
  taxPrice: insertProductSchema.shape.price,
  sessionCardId: z.string(),
  userId: z.number().optional().nullable(),
});
