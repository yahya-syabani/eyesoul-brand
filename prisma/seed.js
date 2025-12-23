/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
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
      category: 'frames-only',
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

