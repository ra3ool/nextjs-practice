import { z } from 'zod';
import { insertProductSchema } from './product.schema';

export const cartItemSchema = z.object({
  productId: z.number(),
  name: insertProductSchema.shape.name,
  slug: insertProductSchema.shape.slug,
  qty: z.number().int().nonnegative('Quantity must be positive number'),
  image: z.string(),
  price: insertProductSchema.shape.price,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: insertProductSchema.shape.price,
  totalPrice: insertProductSchema.shape.price,
  shippingPrice: insertProductSchema.shape.price,
  taxPrice: insertProductSchema.shape.price,
  sessionCartId: z.string(),
  userId: z.number().optional().nullable(),
});
