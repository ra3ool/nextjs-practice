import { PrismaClient } from '@prisma/client';
import { seedProducts } from './seeders/seed-products';
import { seedUsers } from './seeders/seed-users';

const db = new PrismaClient();

async function main() {
  await seedUsers(db);
  await seedProducts(db);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    console.log('✅ Database disconnected');
  });
