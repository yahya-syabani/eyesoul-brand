import { PrismaClient } from '@prisma/client'

// Prevent multiple PrismaClient instances in dev/hot reload.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// Get database URL - support both DATABASE_URL and POSTGRES_PRISMA_URL (Neon convention)
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL

if (!databaseUrl) {
  throw new Error(
    'Missing database URL. Please set DATABASE_URL or POSTGRES_PRISMA_URL in your environment variables.'
  )
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
    // Add connection timeout and retry configuration for Neon
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })

// In serverless environments (production), don't connect eagerly
// Connections will be established on-demand with the first query
// This is optimal for Neon's connection pooling
if (process.env.NODE_ENV !== 'production') {
  // Only connect eagerly in development to catch connection issues early
  if (!globalForPrisma.prisma) {
    prisma.$connect().catch((error) => {
      // Connection will be retried on first query
      console.warn('Initial Prisma connection warning (will retry on query):', error.message)
    })
  }
  globalForPrisma.prisma = prisma
}

export default prisma

