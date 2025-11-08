import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

const prismaClientSingleton = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

const prisma = globalThis.__prisma__ ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma__ = prisma;
}

export default prisma;
