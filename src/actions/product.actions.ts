import { ProductWithRelations } from '@/types';
import { PrismaClient } from '@prisma/client';

interface GetProductById {
  id: number;
}
interface GetProductBySlug {
  slug: string;
}
type GetProductParams = GetProductById | GetProductBySlug;

const db = new PrismaClient();

//FIXME to don't use any
const convertProduct = (product: any): ProductWithRelations => ({
  ...product,
  images: JSON.parse(product.images),
  price: Number(product.price),
  rate: Number(product.rate),
});

export const getProducts = async (
  limit: number = 20,
): Promise<ProductWithRelations[]> => {
  try {
    const data = await db.product.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true, brand: true },
    });

    return data.length ? data.map(convertProduct) : [];
  } catch (error) {
    console.error('Error fetching product list:', error);
    return [];
  } finally {
    await db.$disconnect();
  }
};

export const getProduct = async (
  params: GetProductParams,
): Promise<ProductWithRelations | null> => {
  try {
    const where = 'id' in params ? { id: params.id } : { slug: params.slug };

    const product = await db.product.findUnique({
      where,
      include: { category: true, brand: true },
    });

    return product ? convertProduct(product) : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  } finally {
    await db.$disconnect();
  }
};
