import { z } from 'zod';

const decimalSchema = z
  .union([z.number().min(0), z.string().regex(/^\d+(\.\d{1,2})?$/)])
  .transform((val) => (typeof val === 'string' ? parseFloat(val) : val));

export const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  qty: z.number().int().min(1, 'Quantity must be at least 1'),
  image: z.string().url().or(z.string().min(1)),
  price: decimalSchema.refine((val) => val >= 0, 'Price cannot be negative'),
});

export const insertCartSchema = z.object({
  sessionCartId: z.string().uuid(),
  userId: z.number().int().positive().optional().nullable(),
  items: z.array(cartItemSchema).default([]),
  itemsPrice: decimalSchema.default(0),
  shippingPrice: decimalSchema.default(0),
  taxPrice: decimalSchema.default(0),
  totalPrice: decimalSchema.default(0),
});

export const cartResponseSchema = insertCartSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
});
