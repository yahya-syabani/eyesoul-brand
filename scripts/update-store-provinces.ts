import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapping of city/district patterns to provinces
const provinceMapping: Record<string, string> = {
  'Banten': 'Banten',
  'Tangerang': 'Banten',
  'Tangerang Selatan': 'Banten',
  'Jawa Timur': 'Jawa Timur',
  'Surabaya': 'Jawa Timur',
  'Malang': 'Jawa Timur',
  'Jawa Barat': 'Jawa Barat',
  'Bekasi': 'Jawa Barat',
  'Bandung': 'Jawa Barat',
  'Cirebon': 'Jawa Barat',
  'Depok': 'Jawa Barat',
  'Garut': 'Jawa Barat',
  'Bogor': 'Jawa Barat',
  'DKI Jakarta': 'DKI Jakarta',
  'Jakarta Selatan': 'DKI Jakarta',
  'Jakarta Barat': 'DKI Jakarta',
  'Jakarta Pusat': 'DKI Jakarta',
  'Jakarta Utara': 'DKI Jakarta',
  'Jakarta Timur': 'DKI Jakarta',
  'Jawa Tengah': 'Jawa Tengah',
  'Semarang': 'Jawa Tengah',
  'Sulawesi Selatan': 'Sulawesi Selatan',
  'Makassar': 'Sulawesi Selatan',
  'Gowa': 'Sulawesi Selatan',
  'Riau': 'Riau',
  'Pekanbaru': 'Riau',
  'Bali': 'Bali',
  'Denpasar': 'Bali',
  'Kalimantan Selatan': 'Kalimantan Selatan',
  'Banjarmasin': 'Kalimantan Selatan',
  'Sulawesi Tengah': 'Sulawesi Tengah',
  'Palu': 'Sulawesi Tengah',
  'Kepulauan Riau': 'Kepulauan Riau',
  'Batam': 'Kepulauan Riau',
}

// Function to extract province from address
function extractProvinceFromAddress(address: string): string | null {
  if (!address) return null

  const addressUpper = address.toUpperCase()
  
  // Check for province names directly in address (most specific first)
  const provinceOrder = [
    'KEPULAUAN RIAU',
    'KALIMANTAN SELATAN',
    'SULAWESI TENGAH',
    'SULAWESI SELATAN',
    'DKI JAKARTA',
    'JAWA TENGAH',
    'JAWA TIMUR',
    'JAWA BARAT',
    'BANTEN',
    'RIAU',
    'BALI',
  ]

  // Check for full province names first
  for (const province of provinceOrder) {
    if (addressUpper.includes(province)) {
      // Map to correct case
      return Object.keys(provinceMapping).find(key => key.toUpperCase() === province) || province
    }
  }

  // Check for city/district patterns
  for (const [key, province] of Object.entries(provinceMapping)) {
    if (key !== province && addressUpper.includes(key.toUpperCase())) {
      return province
    }
  }

  return null
}

async function main() {
  console.log('🔄 Starting province migration for store locations...\n')

  try {
    // Get all store locations (check for empty province strings)
    const allStores = await prisma.storeLocation.findMany()
    const stores = allStores.filter(store => !store.province || store.province.trim() === '')

    console.log(`Found ${stores.length} store locations without province\n`)

    if (stores.length === 0) {
      console.log('✅ All stores already have province values!')
      return
    }

    let updated = 0
    let failed = 0

    for (const store of stores) {
      const extractedProvince = extractProvinceFromAddress(store.address)
      
      if (extractedProvince) {
        try {
          await prisma.storeLocation.update({
            where: { id: store.id },
            data: { province: extractedProvince },
          })
          console.log(`✓ Updated "${store.name}" -> ${extractedProvince}`)
          updated++
        } catch (error) {
          console.error(`✗ Failed to update "${store.name}":`, error)
          failed++
        }
      } else {
        console.warn(`⚠ Could not extract province for "${store.name}"`)
        console.warn(`  Address: ${store.address}`)
        failed++
      }
    }

    console.log(`\n✅ Migration completed!`)
    console.log(`   Updated: ${updated}`)
    console.log(`   Failed: ${failed}`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

