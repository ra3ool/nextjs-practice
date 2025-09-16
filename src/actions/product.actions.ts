import { PrismaClient } from '@prisma/client';

export const getProducts = async (limit: number = 20) => {
  const db = new PrismaClient();

  const data = await db.product.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      brand: true,
    },
  });

  const productsWithParsedImages = data.map((product) => ({
    ...product,
    images: JSON.parse(product.images) as string[],
    price: Number(product.price),
    rate: Number(product.rate),
  }));

  await db.$disconnect();
  return productsWithParsedImages;
};
