import {
  insertProductSchema,
  productResponseSchema,
} from '@/schemas/product.schema';
import { z } from 'zod';

export type ProductBase = z.infer<typeof insertProductSchema>;

export type Product = z.infer<typeof productResponseSchema>;

export type ProductWithRelations = Product & {
  brand: { id: number; name: string; slug: string };
  category: { id: number; name: string; slug: string };
};
