import { serializePrisma } from '@/utils/serialize-prisma';
import { Prisma, PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaInstance =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaInstance;
}

// if we wanna prisma middleware, can use this

// const prismaWithSerialization = prismaInstance.$extends({
//   query: {
//     $allModels: {
//       async $allOperations({ operation, model, args, query }) {
//         const result = await query(args);
//         return serializePrisma(result);
//       },
//     },
//   },
// }) as PrismaClient;

export { prismaInstance as prisma, Prisma, PrismaClient };
