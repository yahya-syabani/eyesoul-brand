/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const productData = require(path.join(__dirname, '..', 'src', 'data', 'Product.json'))

const mapCategory = () => 'sunglasses'

async function run() {
  for (const item of productData) {
    await prisma.product.upsert({
      where: { slug: item.slug || `legacy-${item.id}` },
      update: {},
      create: {
        name: item.name,
        slug: item.slug || `legacy-${item.id}`,
        category: mapCategory(),
        type: mapCategory(),
        description: item.description || '',
        price: item.price || 0,
        originPrice: item.originPrice || item.price || 0,
        brand: item.brand || 'eyesoul',
        rate: item.rate || 0,
        sold: item.sold || 0,
        quantity: item.quantity || 0,
        isNew: Boolean(item.new),
        isSale: Boolean(item.sale),
        images: item.images && item.images.length > 0 ? item.images : ['/images/product/1000x1000.png'],
        thumbImages: item.thumbImage && item.thumbImage.length > 0 ? item.thumbImage : ['/images/product/1000x1000.png'],
        variations: item.variation && item.variation.length
          ? { create: item.variation.map((v) => ({ color: v.color, colorCode: v.colorCode, colorImage: v.colorImage, image: v.image })) }
          : undefined,
        attributes: {
          create: {
            lensType: 'single-vision',
            frameMaterial: 'acetate',
            frameSize: { bridgeWidth: 18, templeLength: 145, lensWidth: 54 },
            lensCoating: ['uv-protection'],
          },
        },
        sizes: item.sizes && item.sizes.length ? { create: item.sizes.map((size) => ({ size })) } : undefined,
      },
    })
  }
}

run()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

