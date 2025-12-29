import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Clearing all store locations...')
  
  const result = await prisma.storeLocation.deleteMany({})
  
  console.log(`✅ Deleted ${result.count} store locations`)
}

main()
  .catch((e) => {
    console.error('❌ Error clearing store locations:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })





