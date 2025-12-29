import { PrismaClient } from '@prisma/client'

// Prevent multiple PrismaClient instances in dev/hot reload.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
    // Add connection timeout and retry configuration for Neon
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

// Add $connect error handling - connection will be retried on first query
if (!globalForPrisma.prisma) {
  prisma.$connect().catch((error) => {
    // Connection will be retried on first query
    console.warn('Initial Prisma connection warning (will retry on query):', error.message)
  })
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma

