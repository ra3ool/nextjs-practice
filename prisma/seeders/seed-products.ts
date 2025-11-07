import { products } from '@/db/products';
import { PrismaClient } from '@/lib/prisma-client';
import { createSlug } from '@/utils/create-slug';

export async function seedProducts(db: PrismaClient) {
  console.log('🌱 Seeding products...');

  // categories
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const categoryMap: Record<string, number> = {};
  for (const name of categories) {
    const slug = createSlug(name);
    const category = await db.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    categoryMap[name] = category.id;
  }

  // brands
  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const brandMap: Record<string, number> = {};
  for (const name of brands) {
    const slug = createSlug(name);
    const brand = await db.brand.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    brandMap[name] = brand.id;
  }

  // products
  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        rate: p.rate,
        stock: p.stock,
        images: JSON.stringify(p.images),
        categoryId: categoryMap[p.category],
        brandId: brandMap[p.brand],
      },
    });
  }

  console.log('📦 Products seeded');
}
