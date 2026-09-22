import { PrismaClient } from "@prisma/client";
import { env } from "@repo/env/web";

declare global {
  var prisma: PrismaClient | undefined;
}

export const createClient = () => {
  // Reuse the connection during development and server execution.
  if (global.prisma) {
    return global.prisma;
  }

  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  });

  // Never print the database URL because it contains credentials.
  global.prisma = prisma;

  return prisma;
};

export const client = {
  get db() {
    return createClient();
  },
};