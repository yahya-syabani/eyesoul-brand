import { PrismaClient } from '@prisma/client'

// Prevent multiple PrismaClient instances in dev/hot reload.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// Support both DATABASE_URL and POSTGRES_PRISMA_URL (Neon convention)
// If DATABASE_URL is not set but POSTGRES_PRISMA_URL is, use it as DATABASE_URL
// This ensures Prisma can read it during build and runtime
if (!process.env.DATABASE_URL && process.env.POSTGRES_PRISMA_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL
}

// Create Prisma client
// Prisma will automatically read DATABASE_URL from process.env
// If not set, it will error when the database is actually used (not during build)
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
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

