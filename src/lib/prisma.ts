import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // optional: helpful during dev
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
