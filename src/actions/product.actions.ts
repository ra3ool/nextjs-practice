import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export const getProducts = async (limit: number = 20) => {
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
    images: JSON.parse(product.images),
    price: Number(product.price),
    rate: Number(product.rate),
  }));

  await db.$disconnect();
  return productsWithParsedImages;
};
