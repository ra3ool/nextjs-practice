import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedUsers(db: PrismaClient) {
  const hashed = await bcrypt.hash('1234', 10);

  await db.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashed,
      name: 'Rasool',
      role: 'admin',
    },
  });

  console.log('👤 Users seeded');
}
