import { seedProducts } from './seeders/seed-products';
import { seedUsers } from './seeders/seed-users';

async function main() {
  await seedUsers();
  await seedProducts();
}

main();
