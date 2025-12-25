import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import productData from '../src/data/Product.json'
import blogData from '../src/data/Blog.json'
import testimonialData from '../src/data/Testimonial.json'
import { DISCOUNT_CODES } from '../src/lib/constants'

const prisma = new PrismaClient()

const mapCategory = (oldCategory: string): 'sunglasses' | 'prescription_glasses' | 'reading_glasses' | 'contact_lenses' | 'frames_only' => {
  // Map old categories to new schema
  if (oldCategory === 'eyewear') return 'sunglasses'
  if (oldCategory === 'prescription-glasses' || oldCategory === 'prescription_glasses') return 'prescription_glasses'
  if (oldCategory === 'reading-glasses' || oldCategory === 'reading_glasses') return 'reading_glasses'
  if (oldCategory === 'contact-lenses' || oldCategory === 'contact_lenses') return 'contact_lenses'
  if (oldCategory === 'frames-only' || oldCategory === 'frames_only') return 'frames_only'
  return 'sunglasses' // default
}

async function main() {
  console.log('🌱 Starting database seed...\n')

  // 1. Seed Admin User
  console.log('👤 Seeding admin user...')
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
  console.log('✅ Admin user created: admin@eyesoul.com / admin123\n')

  // 2. Seed Products
  console.log(`📦 Seeding ${productData.length} products...`)
  let productCount = 0
  for (const item of productData) {
    try {
      await prisma.product.upsert({
        where: { slug: item.slug || `legacy-${item.id}` },
        update: {},
        create: {
          name: item.name,
          slug: item.slug || `legacy-${item.id}`,
          category: mapCategory(item.category),
          type: mapCategory(item.category),
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
            ? {
                create: item.variation.map((v: any) => ({
                  color: v.color || 'black',
                  colorCode: v.colorCode || '#1F1F1F',
                  colorImage: v.colorImage || '/images/product/color/48x48.png',
                  image: v.image || '/images/product/1000x1000.png',
                })),
              }
            : undefined,
          attributes: {
            create: {
              lensType: 'single-vision',
              frameMaterial: 'acetate',
              frameSize: { bridgeWidth: 18, templeLength: 145, lensWidth: 54 },
              lensCoating: ['uv-protection'],
            },
          },
          sizes: item.sizes && item.sizes.length
            ? { create: item.sizes.map((size: string) => ({ size })) }
            : undefined,
        },
      })
      productCount++
      if (productCount % 50 === 0) {
        console.log(`  Processed ${productCount}/${productData.length} products...`)
      }
    } catch (error) {
      console.error(`  ❌ Error seeding product ${item.id}:`, error)
    }
  }
  console.log(`✅ Seeded ${productCount} products successfully\n`)

  // 3. Seed Promotions
  console.log(`🎫 Seeding ${DISCOUNT_CODES.length} promotions...`)
  let promotionCount = 0
  for (const promo of DISCOUNT_CODES) {
    try {
      await prisma.promotion.upsert({
        where: { code: promo.code },
        update: {},
        create: {
          code: promo.code,
          discountPercent: promo.discountPercent,
          minOrder: promo.minOrder,
          isActive: true,
          validFrom: null,
          validUntil: null,
          usageLimit: null,
        },
      })
      promotionCount++
    } catch (error) {
      console.error(`  ❌ Error seeding promotion ${promo.code}:`, error)
    }
  }
  console.log(`✅ Seeded ${promotionCount} promotions successfully\n`)

  // 4. Seed Blogs
  console.log(`📝 Seeding ${blogData.length} blogs...`)
  let blogCount = 0
  for (const blog of blogData) {
    try {
      await prisma.blog.upsert({
        where: { slug: blog.slug },
        update: {},
        create: {
          title: blog.title,
          slug: blog.slug,
          category: blog.category,
          tag: blog.tag || null,
          author: blog.author,
          avatar: blog.avatar || null,
          thumbImg: blog.thumbImg || null,
          coverImg: blog.coverImg || null,
          subImg: blog.subImg || [],
          shortDesc: blog.shortDesc,
          description: blog.description,
          date: blog.date,
        },
      })
      blogCount++
    } catch (error) {
      console.error(`  ❌ Error seeding blog ${blog.id}:`, error)
    }
  }
  console.log(`✅ Seeded ${blogCount} blogs successfully\n`)

  // 5. Seed Testimonials
  console.log(`⭐ Seeding ${testimonialData.length} testimonials...`)
  let testimonialCount = 0
  for (const testimonial of testimonialData) {
    try {
      await prisma.testimonial.upsert({
        where: { id: testimonial.id },
        update: {},
        create: {
          id: testimonial.id,
          name: testimonial.name,
          title: testimonial.title,
          description: testimonial.description,
          avatar: testimonial.avatar || null,
          images: testimonial.images || [],
          star: testimonial.star,
          date: testimonial.date,
          address: testimonial.address || null,
          category: testimonial.category,
        },
      })
      testimonialCount++
    } catch (error) {
      console.error(`  ❌ Error seeding testimonial ${testimonial.id}:`, error)
    }
  }
  console.log(`✅ Seeded ${testimonialCount} testimonials successfully\n`)

  console.log('🎉 Database seed completed successfully!')
  console.log(`\nSummary:`)
  console.log(`  - Users: 1 (admin)`)
  console.log(`  - Products: ${productCount}`)
  console.log(`  - Promotions: ${promotionCount}`)
  console.log(`  - Blogs: ${blogCount}`)
  console.log(`  - Testimonials: ${testimonialCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

