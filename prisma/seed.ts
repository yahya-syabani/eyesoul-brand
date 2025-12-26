import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { DISCOUNT_CODES } from '../src/lib/constants'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Translation helper type
type TranslationObject = {
  en: string
  id?: string
}

// Helper function to convert string to translation object
function stringToTranslation(text: string, idTranslation?: string): TranslationObject {
  return {
    en: text || '',
    id: idTranslation || '',
  }
}

// Helper function to generate URL-friendly slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Conditionally load JSON files if they exist (for initial seeding only)
function loadJsonFile(filePath: string): any[] | null {
  try {
    const fullPath = path.join(__dirname, '..', filePath)
    if (fs.existsSync(fullPath)) {
      const fileContent = fs.readFileSync(fullPath, 'utf-8')
      const data = JSON.parse(fileContent)
      console.log(`📄 Loaded ${data.length} items from ${filePath}`)
      return data
    }
    return null
  } catch (error) {
    console.warn(`⚠️  JSON file not found: ${filePath} (this is OK if data is already in database)`)
    return null
  }
}

console.log('📂 Loading JSON data files...')
const productData = loadJsonFile('src/data/Product.json') || []
const blogData = loadJsonFile('src/data/Blog.json') || []
const testimonialData = loadJsonFile('src/data/Testimonial.json') || []
console.log('')

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
  const startTime = Date.now()
  console.log('🌱 Starting database seed...')
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`)

  // Check if data already exists
  const [existingProductCount, existingBlogCount, existingTestimonialCount, existingStoreLocationCount, existingHeroSlideCount, existingTagCount] = await Promise.all([
    prisma.product.count(),
    prisma.blog.count(),
    prisma.testimonial.count(),
    prisma.storeLocation.count(),
    prisma.heroSlide.count(),
    prisma.tag.count(),
  ])

  console.log(`📊 Current database state:`)
  console.log(`  - Products: ${existingProductCount}`)
  console.log(`  - Blogs: ${existingBlogCount}`)
  console.log(`  - Testimonials: ${existingTestimonialCount}`)
  console.log(`  - Hero Slides: ${existingHeroSlideCount}`)
  console.log(`  - Tags: ${existingTagCount}\n`)

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

  // 2. Seed Tags
  console.log('🏷️  Seeding tags...')
  const defaultTags = [
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Health', slug: 'health' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Lifestyle', slug: 'lifestyle' },
    { name: 'Eyewear Tips', slug: 'eyewear-tips' },
    { name: 'Style Guide', slug: 'style-guide' },
    { name: 'Eye Care', slug: 'eye-care' },
  ]

  let tagCount = 0
  let tagCreated = 0
  let tagUpdated = 0
  for (const tag of defaultTags) {
    try {
      const existing = await prisma.tag.findUnique({ where: { slug: tag.slug } })
      await prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: {
          name: tag.name,
          slug: tag.slug,
        },
      })
      if (existing) {
        tagUpdated++
      } else {
        tagCreated++
        console.log(`  ✓ Created tag: ${tag.name} (${tag.slug})`)
      }
      tagCount++
    } catch (error) {
      console.error(`  ❌ Error seeding tag ${tag.name}:`, error)
    }
  }
  console.log(`✅ Tags: ${tagCount} total (${tagCreated} created, ${tagUpdated} already existed)\n`)

  // 3. Seed Hero Slides
  if (existingHeroSlideCount > 0) {
    console.log(`⚠️  Database already has ${existingHeroSlideCount} hero slides. Skipping hero slide seeding to prevent duplicates.\n`)
  } else {
    console.log('🎠 Seeding hero slides...')
    const defaultHeroSlides = [
      {
        subtitle: 'Sale! Up To 50% Off!',
        subtitleTranslations: stringToTranslation('Sale! Up To 50% Off!', 'Diskon! Hingga 50%!'),
        title: 'Summer Sale Collections',
        titleTranslations: stringToTranslation('Summer Sale Collections', 'Koleksi Diskon Musim Panas'),
        imageUrl: '/images/slider/bg7-1.png',
        ctaText: 'Shop Now',
        ctaTextTranslations: stringToTranslation('Shop Now', 'Belanja Sekarang'),
        ctaLink: '/shop/default',
        isActive: true,
        displayOrder: 0,
        imageWidth: 'sm:w-[48%] w-[54%]',
        imagePosition: '2xl:-right-[60px] right-0 bottom-0',
      },
      {
        subtitle: 'Sale! Up To 50% Off!',
        subtitleTranslations: stringToTranslation('Sale! Up To 50% Off!', 'Diskon! Hingga 50%!'),
        title: 'Discover the Latest Trends in Eyewear',
        titleTranslations: stringToTranslation('Discover the Latest Trends in Eyewear', 'Temukan Tren Terbaru dalam Kacamata'),
        imageUrl: '/images/slider/bg2-2.png',
        ctaText: 'Shop Now',
        ctaTextTranslations: stringToTranslation('Shop Now', 'Belanja Sekarang'),
        ctaLink: '/shop/default',
        isActive: true,
        displayOrder: 1,
        imageWidth: 'sm:w-1/2 w-3/5',
        imagePosition: '2xl:-right-[60px] -right-4 bottom-0',
      },
      {
        subtitle: 'Sale! Up To 50% Off!',
        subtitleTranslations: stringToTranslation('Sale! Up To 50% Off!', 'Diskon! Hingga 50%!'),
        title: 'New season, new wardrobe!',
        titleTranslations: stringToTranslation('New season, new wardrobe!', 'Musim baru, lemari baru!'),
        imageUrl: '/images/slider/bg2-3.png',
        ctaText: 'Shop Now',
        ctaTextTranslations: stringToTranslation('Shop Now', 'Belanja Sekarang'),
        ctaLink: '/shop/default',
        isActive: true,
        displayOrder: 2,
        imageWidth: 'sm:w-[43%] w-3/5',
        imagePosition: '2xl:-right-[36px] right-0 sm:bottom-0 -bottom-[30px]',
      },
    ]

    let heroSlideCount = 0
    for (const slide of defaultHeroSlides) {
      try {
        await prisma.heroSlide.create({
          data: {
            subtitle: slide.subtitle,
            subtitleTranslations: slide.subtitleTranslations,
            title: slide.title,
            titleTranslations: slide.titleTranslations,
            imageUrl: slide.imageUrl,
            ctaText: slide.ctaText,
            ctaTextTranslations: slide.ctaTextTranslations,
            ctaLink: slide.ctaLink,
            isActive: slide.isActive,
            displayOrder: slide.displayOrder,
            imageWidth: slide.imageWidth,
            imagePosition: slide.imagePosition,
          },
        })
        console.log(`  ✓ Created hero slide: "${slide.title}" (order: ${slide.displayOrder})`)
        heroSlideCount++
      } catch (error) {
        console.error(`  ❌ Error seeding hero slide ${slide.title}:`, error)
      }
    }
    console.log(`✅ Seeded ${heroSlideCount}/${defaultHeroSlides.length} hero slides successfully\n`)
  }

  // 4. Seed Products
  if (existingProductCount > 0) {
    console.log(`⚠️  Database already has ${existingProductCount} products. Skipping product seeding to prevent duplicates.`)
    console.log(`   To re-seed products, clear the database first.\n`)
  } else {
    if (productData.length === 0) {
      console.log('⚠️  No product data found in JSON file. Skipping product seeding.')
      console.log(`   Database already has ${existingProductCount} products.\n`)
    } else {
      console.log(`📦 Seeding ${productData.length} products...`)
      let productCount = 0
      for (const item of productData) {
    try {
      const productName = item.name || ''
      const productDescription = item.description || ''
      
      await prisma.product.upsert({
        where: { slug: item.slug || `legacy-${item.id}` },
        update: {},
        create: {
          name: productName,
          nameTranslations: stringToTranslation(productName, item.nameTranslations?.id || item.nameId || ''),
          slug: item.slug || `legacy-${item.id}`,
          category: mapCategory(item.category),
          type: mapCategory(item.category),
          description: productDescription,
          descriptionTranslations: stringToTranslation(productDescription, item.descriptionTranslations?.id || item.descriptionId || ''),
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
    }
  }

  // 5. Seed Promotions
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

  // 6. Seed Blogs
  if (existingBlogCount > 0) {
    console.log(`⚠️  Database already has ${existingBlogCount} blogs. Skipping blog seeding to prevent duplicates.`)
    console.log(`   To re-seed blogs, clear the database first.\n`)
  } else {
    if (blogData.length === 0) {
      console.log('⚠️  No blog data found in JSON file. Skipping blog seeding.')
      console.log(`   Database already has ${existingBlogCount} blogs.\n`)
    } else {
      console.log(`📝 Seeding ${blogData.length} blogs...`)
      let blogCount = 0
      for (const blog of blogData) {
    try {
      const blogTitle = blog.title || ''
      const blogShortDesc = blog.shortDesc || ''
      const blogDescription = blog.description || ''
      
      // Handle tags: support both old 'tag' field and new 'tags' array
      let tagSlugs: string[] = []
      
      // If blog has tags array, use those
      if (blog.tags && Array.isArray(blog.tags)) {
        tagSlugs = blog.tags
      } 
      // Otherwise, if blog has a single tag string, convert it to slug and use it
      else if (blog.tag && typeof blog.tag === 'string') {
        tagSlugs = [generateSlug(blog.tag)]
        // Create tag if it doesn't exist
        try {
          const existingTag = await prisma.tag.findUnique({ where: { slug: tagSlugs[0] } })
          await prisma.tag.upsert({
            where: { slug: tagSlugs[0] },
            update: {},
            create: {
              name: blog.tag,
              slug: tagSlugs[0],
            },
          })
          if (!existingTag) {
            console.log(`  ℹ️  Created tag from blog: ${blog.tag} (${tagSlugs[0]})`)
          }
        } catch (tagError) {
          // Tag might already exist, continue
        }
      }
      
      // Find tag IDs
      let tagIds: string[] = []
      if (tagSlugs.length > 0) {
        const tags = await prisma.tag.findMany({
          where: {
            slug: {
              in: tagSlugs,
            },
          },
        })
        tagIds = tags.map((t) => t.id)
      }
      
      await prisma.blog.upsert({
        where: { slug: blog.slug },
        update: {},
        create: {
          title: blogTitle,
          titleTranslations: stringToTranslation(blogTitle, blog.titleTranslations?.id || blog.titleId || ''),
          slug: blog.slug,
          category: blog.category,
          tag: blog.tag || null, // Keep for backward compatibility
          author: blog.author,
          avatar: blog.avatar || null,
          thumbImg: blog.thumbImg || null,
          coverImg: blog.coverImg || null,
          subImg: blog.subImg || [],
          shortDesc: blogShortDesc,
          shortDescTranslations: stringToTranslation(blogShortDesc, blog.shortDescTranslations?.id || blog.shortDescId || ''),
          description: blogDescription,
          descriptionTranslations: stringToTranslation(blogDescription, blog.descriptionTranslations?.id || blog.descriptionId || ''),
          date: blog.date,
          tags: tagIds.length > 0
            ? {
                create: tagIds.map((tagId) => ({ tagId })),
              }
            : undefined,
        },
      })
      if (tagIds.length > 0) {
        console.log(`  ✓ Created blog: "${blogTitle}" with ${tagIds.length} tag(s)`)
      }
        blogCount++
        if (blogCount % 10 === 0) {
          console.log(`  📊 Processed ${blogCount}/${blogData.length} blogs...`)
        }
      } catch (error) {
        console.error(`  ❌ Error seeding blog ${blog.id}:`, error)
      }
      }
      console.log(`✅ Seeded ${blogCount}/${blogData.length} blogs successfully\n`)
    }
  }

  // 7. Seed Testimonials
  if (existingTestimonialCount > 0) {
    console.log(`⚠️  Database already has ${existingTestimonialCount} testimonials. Skipping testimonial seeding to prevent duplicates.`)
    console.log(`   To re-seed testimonials, clear the database first.\n`)
  } else {
    if (testimonialData.length === 0) {
      console.log('⚠️  No testimonial data found in JSON file. Skipping testimonial seeding.')
      console.log(`   Database already has ${existingTestimonialCount} testimonials.\n`)
    } else {
      console.log(`⭐ Seeding ${testimonialData.length} testimonials...`)
      let testimonialCount = 0
      for (const testimonial of testimonialData) {
    try {
      const testimonialTitle = testimonial.title || ''
      const testimonialDescription = testimonial.description || ''
      
      await prisma.testimonial.upsert({
        where: { id: testimonial.id },
        update: {},
        create: {
          id: testimonial.id,
          name: testimonial.name,
          title: testimonialTitle,
          titleTranslations: stringToTranslation(testimonialTitle, testimonial.titleTranslations?.id || testimonial.titleId || ''),
          description: testimonialDescription,
          descriptionTranslations: stringToTranslation(testimonialDescription, testimonial.descriptionTranslations?.id || testimonial.descriptionId || ''),
          avatar: testimonial.avatar || null,
          images: testimonial.images || [],
          star: testimonial.star,
          date: testimonial.date,
          address: testimonial.address || null,
          category: testimonial.category,
        },
      })
        testimonialCount++
        if (testimonialCount % 10 === 0) {
          console.log(`  📊 Processed ${testimonialCount}/${testimonialData.length} testimonials...`)
        }
      } catch (error) {
        console.error(`  ❌ Error seeding testimonial ${testimonial.id}:`, error)
      }
      }
      console.log(`✅ Seeded ${testimonialCount}/${testimonialData.length} testimonials successfully\n`)
    }
  }

  // 8. Seed Store Locations
  if (existingStoreLocationCount > 0) {
    console.log(`⚠️  Database already has ${existingStoreLocationCount} store locations. Skipping store location seeding to prevent duplicates.\n`)
  } else {
    console.log('📍 Seeding store locations...')
    const storeLocations = [
      {
        name: 'Jakarta Central Store',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220',
        phone: '+62 21 5555 1234',
        email: 'jakarta@eyesoul.com',
        hoursWeekdays: 'Mon - Fri: 9:00am - 9:00pm',
        hoursSaturday: 'Saturday: 10:00am - 8:00pm',
        hoursSunday: 'Sunday: 11:00am - 7:00pm',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.935283293612!2d106.81756661477038!3d-6.194621295520468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bce8!2sJl.%20Sudirman%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid',
        latitude: -6.1946,
        longitude: 106.8176,
        displayOrder: 0,
      },
      {
        name: 'Surabaya Store',
        address: 'Jl. Tunjungan No. 45, Surabaya, Jawa Timur 60264',
        phone: '+62 31 7777 5678',
        email: 'surabaya@eyesoul.com',
        hoursWeekdays: 'Mon - Fri: 9:00am - 9:00pm',
        hoursSaturday: 'Saturday: 10:00am - 8:00pm',
        hoursSunday: 'Sunday: 11:00am - 7:00pm',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.715489290856!2d112.75278961477247!3d-7.257473794751906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f963d13b3e5d%3A0x5a6b5e4b5e4b5e4b!2sJl.%20Tunjungan%2C%20Surabaya!5e0!3m2!1sen!2sid!4v1234567890124!5m2!1sen!2sid',
        latitude: -7.2575,
        longitude: 112.7528,
        displayOrder: 1,
      },
      {
        name: 'Bandung Store',
        address: 'Jl. Dago No. 78, Bandung, Jawa Barat 40135',
        phone: '+62 22 8888 9012',
        email: 'bandung@eyesoul.com',
        hoursWeekdays: 'Mon - Fri: 9:00am - 9:00pm',
        hoursSaturday: 'Saturday: 10:00am - 8:00pm',
        hoursSunday: 'Sunday: 11:00am - 7:00pm',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.935283293612!2d107.60856661477038!3d-6.902621295520468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6392c764b12d%3A0x3d2ad6e1e0e9bce8!2sJl.%20Dago%2C%20Bandung!5e0!3m2!1sen!2sid!4v1234567890125!5m2!1sen!2sid',
        latitude: -6.9026,
        longitude: 107.6086,
        displayOrder: 2,
      },
    ]

    let storeLocationCount = 0
    for (const location of storeLocations) {
      try {
        await prisma.storeLocation.create({
          data: location,
        })
        console.log(`  ✓ Created store location: ${location.name}`)
        storeLocationCount++
      } catch (error) {
        console.error(`  ❌ Error seeding store location ${location.name}:`, error)
      }
    }
    console.log(`✅ Seeded ${storeLocationCount}/${storeLocations.length} store locations successfully\n`)
  }

  // Get final counts
  const [finalProductCount, finalBlogCount, finalTestimonialCount, finalStoreLocationCount, finalHeroSlideCount, finalTagCount] = await Promise.all([
    prisma.product.count(),
    prisma.blog.count(),
    prisma.testimonial.count(),
    prisma.storeLocation.count(),
    prisma.heroSlide.count(),
    prisma.tag.count(),
  ])

  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  console.log('🎉 Database seed completed successfully!')
  console.log(`⏰ Completed in ${duration} seconds`)
  console.log(`\n📊 Final Summary:`)
  console.log(`  - Users: 1 (admin)`)
  console.log(`  - Products: ${finalProductCount}`)
  console.log(`  - Promotions: ${promotionCount}`)
  console.log(`  - Blogs: ${finalBlogCount}`)
  console.log(`  - Testimonials: ${finalTestimonialCount}`)
  console.log(`  - Store Locations: ${finalStoreLocationCount}`)
  console.log(`  - Hero Slides: ${finalHeroSlideCount}`)
  console.log(`  - Tags: ${finalTagCount}`)
  console.log(`\n✨ All seeding operations completed!`)
}

main()
  .catch((e) => {
    console.error('\n❌ Seed failed with error:')
    console.error(e)
    if (e instanceof Error) {
      console.error(`\nError details:`)
      console.error(`  Message: ${e.message}`)
      console.error(`  Stack: ${e.stack}`)
    }
    process.exit(1)
  })
  .finally(async () => {
    console.log('\n🔌 Disconnecting from database...')
    await prisma.$disconnect()
    console.log('✅ Database connection closed')
  })

