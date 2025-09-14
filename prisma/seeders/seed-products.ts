import { products } from '@/db/products';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export async function seedProducts() {
  await db.product.deleteMany();
  await db.product.createMany({ data: products });
}
