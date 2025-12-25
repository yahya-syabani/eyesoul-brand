/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@eyesoul.com' },
    update: {},
    create: {
      email: 'admin@eyesoul.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('Admin user created: admin@eyesoul.com / admin123')

  const sampleProducts = [
    {
      name: 'AeroLite Sunglasses',
      slug: 'aerolite-sunglasses',
      category: 'sunglasses',
      description: 'Featherweight polarized sunglasses with UV400 protection.',
      price: 120,
      originPrice: 150,
      brand: 'eyesoul',
      images: ['/images/product/1000x1000.png'],
      thumbImages: ['/images/product/1000x1000.png'],
      rate: 5,
      sold: 10,
      quantity: 50,
      isNew: true,
      isSale: true,
      variations: [
        { color: 'black', colorCode: '#1F1F1F', colorImage: '/images/product/color/48x48.png', image: '/images/product/1000x1000.png' },
      ],
      attributes: {
        lensType: 'single-vision',
        frameMaterial: 'acetate',
        frameSize: { bridgeWidth: 18, templeLength: 145, lensWidth: 54 },
        lensCoating: ['uv-protection', 'anti-reflective'],
      },
      sizes: [{ size: 'medium' }],
    },
    {
      name: 'Clarity Blue Light Glasses',
      slug: 'clarity-blue-light',
      category: 'frames_only',
      description: 'Blue-light blocking frames designed for all-day comfort.',
      price: 90,
      originPrice: 120,
      brand: 'clarity',
      images: ['/images/product/1000x1000.png'],
      thumbImages: ['/images/product/1000x1000.png'],
      rate: 4,
      sold: 5,
      quantity: 80,
      isNew: true,
      isSale: false,
      variations: [
        { color: 'red', colorCode: '#DB4444', colorImage: '/images/product/color/48x48.png', image: '/images/product/1000x1000.png' },
      ],
      attributes: {
        lensType: 'single-vision',
        frameMaterial: 'metal',
        frameSize: { bridgeWidth: 17, templeLength: 142, lensWidth: 52 },
        lensCoating: ['blue-light', 'scratch-resistant'],
      },
      sizes: [{ size: 'small' }],
    },
    {
      name: 'Vision Pro Prescription Glasses',
      slug: 'vision-pro-prescription',
      category: 'prescription_glasses',
      description: 'Premium prescription glasses with anti-reflective coating.',
      price: 180,
      originPrice: 220,
      brand: 'eyesoul',
      images: ['/images/product/1000x1000.png'],
      thumbImages: ['/images/product/1000x1000.png'],
      rate: 5,
      sold: 25,
      quantity: 60,
      isNew: true,
      isSale: true,
      variations: [
        { color: 'black', colorCode: '#1F1F1F', colorImage: '/images/product/color/48x48.png', image: '/images/product/1000x1000.png' },
        { color: 'brown', colorCode: '#8B4513', colorImage: '/images/product/color/48x48.png', image: '/images/product/1000x1000.png' },
      ],
      attributes: {
        lensType: 'progressive',
        frameMaterial: 'titanium',
        frameSize: { bridgeWidth: 19, templeLength: 140, lensWidth: 56 },
        lensCoating: ['anti-reflective', 'scratch-resistant', 'uv-protection'],
      },
      sizes: [{ size: 'medium' }, { size: 'large' }],
    },
    {
      name: 'Reader Plus Reading Glasses',
      slug: 'reader-plus',
      category: 'reading_glasses',
      description: 'Comfortable reading glasses with blue light filtering.',
      price: 45,
      originPrice: 60,
      brand: 'eyesoul',
      images: ['/images/product/1000x1000.png'],
      thumbImages: ['/images/product/1000x1000.png'],
      rate: 4,
      sold: 30,
      quantity: 100,
      isNew: false,
      isSale: true,
      variations: [
        { color: 'purple', colorCode: '#8684D4', colorImage: '/images/product/color/48x48.png', image: '/images/product/1000x1000.png' },
      ],
      attributes: {
        lensType: 'single-vision',
        frameMaterial: 'acetate',
        frameSize: { bridgeWidth: 18, templeLength: 135, lensWidth: 50 },
        lensCoating: ['blue-light', 'anti-reflective'],
      },
      sizes: [{ size: 'medium' }],
    },
    {
      name: 'Daily Comfort Contact Lenses',
      slug: 'daily-comfort-contacts',
      category: 'contact_lenses',
      description: 'Daily disposable contact lenses for all-day comfort.',
      price: 35,
      originPrice: 45,
      brand: 'eyesoul',
      images: ['/images/product/1000x1000.png'],
      thumbImages: ['/images/product/1000x1000.png'],
      rate: 5,
      sold: 50,
      quantity: 200,
      isNew: true,
      isSale: false,
      variations: [
        { color: 'clear', colorCode: '#FFFFFF', colorImage: '/images/product/color/48x48.png', image: '/images/product/1000x1000.png' },
      ],
      attributes: {
        lensType: 'single-vision',
        frameMaterial: null,
        frameSize: null,
        lensCoating: ['uv-protection'],
      },
      sizes: [{ size: '30-pack' }],
    },
  ]

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        category: product.category,
        type: product.category,
        description: product.description,
        price: product.price,
        originPrice: product.originPrice,
        brand: product.brand,
        rate: product.rate,
        sold: product.sold,
        quantity: product.quantity,
        isNew: product.isNew,
        isSale: product.isSale,
        images: product.images,
        thumbImages: product.thumbImages,
        variations: {
          create: product.variations,
        },
        attributes: {
          create: product.attributes,
        },
        sizes: {
          create: product.sizes,
        },
      },
    })
  }
  console.log(`Seeded ${sampleProducts.length} products successfully`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

