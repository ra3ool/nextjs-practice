'use server';

import { prisma } from '@/lib/prisma-client';
import type { Brand, Category, Product } from '@prisma/client';
import type { ProductWithRelations } from '@/types/product.type';

type ProductWithPrismaRelations = Product & { brand: Brand; category: Category };

const convertProduct = (product: ProductWithPrismaRelations): ProductWithRelations => ({
  ...product,
  images: JSON.parse(product.images as string),
  price: Number(product.price),
  rate: Number(product.rate),
});

export const getProducts = async (
  limit: number = 20,
): Promise<ProductWithRelations[]> => {
  try {
    const data = await prisma.product.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true, brand: true },
    });

    return data.length ? data.map(convertProduct) : [];
  } catch (error) {
    console.error('Error fetching product list:', error);
    return [];
  }
};

export const getProduct = async (params: {
  id?: number;
  slug?: string;
}): Promise<ProductWithRelations | null> => {
  try {
    const where = params.id ? { id: params.id } : { slug: params.slug };

    const product = await prisma.product.findUnique({
      where,
      include: { category: true, brand: true },
    });

    return product ? convertProduct(product) : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};
