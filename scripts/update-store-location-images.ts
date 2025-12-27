import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Placeholder image path - using a banner image as placeholder
const PLACEHOLDER_IMAGE = '/images/banner/1.png'

async function main() {
  console.log('🖼️  Updating store locations with placeholder images...')
  
  // Update all store locations that don't have an imageUrl
  const result = await prisma.storeLocation.updateMany({
    where: {
      imageUrl: null,
    },
    data: {
      imageUrl: PLACEHOLDER_IMAGE,
    },
  })

  console.log(`✅ Updated ${result.count} store locations with placeholder image: ${PLACEHOLDER_IMAGE}`)
}

main()
  .catch((e) => {
    console.error('❌ Error updating store locations:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

