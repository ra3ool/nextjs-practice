import { Prisma, PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaInstance =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // optional: helpful during dev
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prismaInstance;

export { prismaInstance as prisma, Prisma, PrismaClient };
