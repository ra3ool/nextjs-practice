import { z } from 'zod';
import { decimalSchema } from './shared.schema';

export const insertProductSchema = z.object({
  name: z.string().min(3).max(255).trim(),
  slug: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  description: z.string().min(10).max(2000).trim(),
  categoryId: z.number().int().positive(),
  brandId: z.number().int().positive(),
  price: decimalSchema,
  rate: z.number().min(0).max(5).multipleOf(0.1).default(0),
  stock: z.number().int().min(0).default(0),
  images: z
    .array(z.string().url().or(z.string().min(1)))
    .min(1)
    .max(10),
});

export const updateProductSchema = insertProductSchema.partial();

export const productResponseSchema = insertProductSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
});
