import { z } from 'zod';

export const insertProductSchema = z.object({
  name: z.string().min(3).max(255),
  slug: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(10).max(2000),
  categoryId: z.number().int().positive(),
  brandId: z.number().int().positive(),
  price: z.number().positive().max(999999999.99),
  rate: z.number().min(0).max(5).optional().default(0),
  stock: z.number().min(0).positive().default(0),
  images: z.array(z.url()).min(1).max(10),
});

export const updateProductSchema = insertProductSchema.partial();

export const productResponseSchema = insertProductSchema.extend({
  id: z.number(),
  createdAt: z.date(),
});
