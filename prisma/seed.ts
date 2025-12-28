import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as fs from 'fs'
import * as path from 'path'

import { DISCOUNT_CODES } from '../src/lib/constants'

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

const mapCategory = (
  oldCategory: string,
): 'sunglasses' | 'prescription_glasses' | 'reading_glasses' | 'contact_lenses' | 'frames_only' => {
  // Map old categories to new schema
  if (oldCategory === 'eyewear') return 'sunglasses'
  if (oldCategory === 'prescription-glasses' || oldCategory === 'prescription_glasses')
    return 'prescription_glasses'
  if (oldCategory === 'reading-glasses' || oldCategory === 'reading_glasses')
    return 'reading_glasses'
  if (oldCategory === 'contact-lenses' || oldCategory === 'contact_lenses') return 'contact_lenses'
  if (oldCategory === 'frames-only' || oldCategory === 'frames_only') return 'frames_only'
  return 'sunglasses' // default
}

async function main() {
  const startTime = Date.now()
  console.log('🌱 Starting database seed...')
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`)

  // Check if data already exists
  const [
    existingProductCount,
    existingBlogCount,
    existingTestimonialCount,
    existingStoreLocationCount,
    existingHeroSlideCount,
    existingTagCount,
  ] = await Promise.all([
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
    console.log(
      `⚠️  Database already has ${existingHeroSlideCount} hero slides. Skipping hero slide seeding to prevent duplicates.\n`,
    )
  } else {
    console.log('🎠 Seeding hero slides...')
    const defaultHeroSlides = [
      {
        subtitle: 'Sale! Up To 50% Off!',
        subtitleTranslations: stringToTranslation('Sale! Up To 50% Off!', 'Diskon! Hingga 50%!'),
        title: 'Summer Sale Collections',
        titleTranslations: stringToTranslation(
          'Summer Sale Collections',
          'Koleksi Diskon Musim Panas',
        ),
        imageUrl: 'https://picsum.photos/1920/1080?random=20',
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
        titleTranslations: stringToTranslation(
          'Discover the Latest Trends in Eyewear',
          'Temukan Tren Terbaru dalam Kacamata',
        ),
        imageUrl: 'https://picsum.photos/1920/1080?random=21',
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
        titleTranslations: stringToTranslation(
          'New season, new wardrobe!',
          'Musim baru, lemari baru!',
        ),
        imageUrl: 'https://picsum.photos/1920/1080?random=22',
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
    console.log(
      `✅ Seeded ${heroSlideCount}/${defaultHeroSlides.length} hero slides successfully\n`,
    )
  }

  // 4. Seed Products
  if (existingProductCount > 0) {
    console.log(
      `⚠️  Database already has ${existingProductCount} products. Skipping product seeding to prevent duplicates.`,
    )
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
              nameTranslations: stringToTranslation(
                productName,
                item.nameTranslations?.id || item.nameId || '',
              ),
              slug: item.slug || `legacy-${item.id}`,
              category: mapCategory(item.category),
              type: mapCategory(item.category),
              description: productDescription,
              descriptionTranslations: stringToTranslation(
                productDescription,
                item.descriptionTranslations?.id || item.descriptionId || '',
              ),
              price: item.price || 0,
              originPrice: item.originPrice || item.price || 0,
              brand: item.brand || 'eyesoul',
              rate: item.rate || 0,
              sold: item.sold || 0,
              quantity: item.quantity || 0,
              isNew: Boolean(item.new),
              isSale: Boolean(item.sale),
              images:
                item.images && item.images.length > 0
                  ? item.images
                  : [], // Images should be uploaded via admin interface
              thumbImages:
                item.thumbImage && item.thumbImage.length > 0
                  ? item.thumbImage
                  : [], // Images should be uploaded via admin interface
              variations:
                item.variation && item.variation.length
                  ? {
                      create: item.variation.map((v: any) => ({
                        color: v.color || 'black',
                        colorCode: v.colorCode || '#1F1F1F',
                        colorImage: v.colorImage || null, // Color swatch images should be uploaded via admin
                        image: v.image || null, // Variation images should be uploaded via admin
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
              sizes:
                item.sizes && item.sizes.length
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
    console.log(
      `⚠️  Database already has ${existingBlogCount} blogs. Skipping blog seeding to prevent duplicates.`,
    )
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
              titleTranslations: stringToTranslation(
                blogTitle,
                blog.titleTranslations?.id || blog.titleId || '',
              ),
              slug: blog.slug,
              category: blog.category,
              tag: blog.tag || null, // Keep for backward compatibility
              author: blog.author,
              avatar: blog.avatar || null,
              thumbImg: blog.thumbImg || null,
              coverImg: blog.coverImg || null,
              subImg: blog.subImg || [],
              shortDesc: blogShortDesc,
              shortDescTranslations: stringToTranslation(
                blogShortDesc,
                blog.shortDescTranslations?.id || blog.shortDescId || '',
              ),
              description: blogDescription,
              descriptionTranslations: stringToTranslation(
                blogDescription,
                blog.descriptionTranslations?.id || blog.descriptionId || '',
              ),
              date: blog.date,
              tags:
                tagIds.length > 0
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
    console.log(
      `⚠️  Database already has ${existingTestimonialCount} testimonials. Skipping testimonial seeding to prevent duplicates.`,
    )
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
              titleTranslations: stringToTranslation(
                testimonialTitle,
                testimonial.titleTranslations?.id || testimonial.titleId || '',
              ),
              description: testimonialDescription,
              descriptionTranslations: stringToTranslation(
                testimonialDescription,
                testimonial.descriptionTranslations?.id || testimonial.descriptionId || '',
              ),
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
            console.log(
              `  📊 Processed ${testimonialCount}/${testimonialData.length} testimonials...`,
            )
          }
        } catch (error) {
          console.error(`  ❌ Error seeding testimonial ${testimonial.id}:`, error)
        }
      }
      console.log(
        `✅ Seeded ${testimonialCount}/${testimonialData.length} testimonials successfully\n`,
      )
    }
  }

  // 8. Seed Store Locations
  if (existingStoreLocationCount > 0) {
    console.log(
      `⚠️  Database already has ${existingStoreLocationCount} store locations. Skipping store location seeding to prevent duplicates.\n`,
    )
  } else {
    console.log('📍 Seeding store locations...')
    // Helper to get placeholder image based on index (uses Unsplash retail store images)
    // NOTE: Store locations should have real images uploaded via admin interface
    // This provides example images from Unsplash for seeding
    const getPlaceholderImage = (index: number) => {
      const keywords = ['optometry-store', 'retail-shop', 'eyewear-store', 'store-interior', 'shop-front', 'retail-interior', 'optical-shop', 'boutique-store', 'mall-shop', 'retail-space']
      const keyword = keywords[index % keywords.length]
      const seed = 30 + (index % 10)
      return `https://picsum.photos/1920/1080?random=${seed}`
    }
    const storeLocations = [
      {
        name: 'Eyesoul Living World Alam Sutera',
        address:
          'Living World Alam Sutera, Lt. UG, Jl. Alam Sutera Boulevard Kav. 21, Pakulonan, Tangerang Selatan, Banten 15325',
        province: 'Banten',
        phone: '+62 817 110 558',
        email: 'cs@eyesouleyewear.co.id',
        imageUrl: 'https://picsum.photos/1920/1080?random=30',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.2435,106.6534',
        latitude: -6.2435,
        longitude: 106.6534,
        displayOrder: 0,
      },
      {
        name: 'Eyesoul Galaxy Mall Surabaya',
        address:
          'Galaxy Mall 1, Lt. 1, Jl. Dharmahusada Indah Timur No. 35-37, Mulyorejo, Surabaya, Jawa Timur 60115',
        province: 'Jawa Timur',
        phone: '+62 817 110 572',
        email: 'cs@eyesouleyewear.co.id',
        imageUrl: 'https://picsum.photos/1920/1080?random=31',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-7.2754,112.7813',
        latitude: -7.2754,
        longitude: 112.7813,
        displayOrder: 1,
      },
      {
        name: 'Eyesoul Living Plaza Jababeka',
        address:
          'Living Plaza Jababeka, Lt. GF, Jl. Niaga Raya No. 2, Mekarmukti, Cikarang Utara, Bekasi, Jawa Barat 17530',
        province: 'Jawa Barat',
        phone: '+62 817 110 556',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.3072,107.1695',
        latitude: -6.3072,
        longitude: 107.1695,
        displayOrder: 2,
      },
      {
        name: 'Eyesoul QBig BSD City',
        address:
          'QBig BSD City, Jl. BSD Raya Utama No. 22, Lengkong Kulon, Pagedangan, Tangerang, Banten 15331',
        province: 'Banten',
        phone: '+62 817 110 570',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.2925,106.6322',
        latitude: -6.2925,
        longitude: 106.6322,
        displayOrder: 3,
      },
      {
        name: 'Eyesoul Living Plaza Kota Harapan Indah',
        address:
          'Living Plaza KHI, Lt. GF, Jl. Harapan Indah Boulevard, Medan Satria, Bekasi, Jawa Barat 17132',
        province: 'Jawa Barat',
        phone: '+62 817 110 568',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.1856,106.9754',
        latitude: -6.1856,
        longitude: 106.9754,
        displayOrder: 4,
      },
      {
        name: 'Eyesoul Living Plaza Cinere',
        address: 'Living Plaza Cinere, Jl. Cinere Raya No. 100, Cinere, Depok, Jawa Barat 16514',
        province: 'Jawa Barat',
        phone: '+62 817 110 559',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.3248,106.7828',
        latitude: -6.3248,
        longitude: 106.7828,
        displayOrder: 5,
      },
      {
        name: 'Eyesoul Gandaria City',
        address:
          'Gandaria City Mall, Lt. UG, Jl. Sultan Iskandar Muda No. 8, Kebayoran Lama, Jakarta Selatan, DKI Jakarta 12240',
        province: 'DKI Jakarta',
        phone: '+62 817 110 575',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.2442,106.7835',
        latitude: -6.2442,
        longitude: 106.7835,
        displayOrder: 6,
      },
      {
        name: 'Eyesoul Queen City Semarang',
        address:
          'Queen City Mall, Lt. GF, Jl. Pemuda No. 29-33, Pandansari, Semarang Tengah, Jawa Tengah 50139',
        province: 'Jawa Tengah',
        phone: '+62 817 110 575',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.9774,110.4208',
        latitude: -6.9774,
        longitude: 110.4208,
        displayOrder: 7,
      },
      {
        name: 'Eyesoul Living Plaza Cirebon',
        address:
          'Living Plaza Cirebon, Lt. GF, Jl. Brigjend Dharsono, Sunyaragi, Cirebon, Jawa Barat 45132',
        province: 'Jawa Barat',
        phone: '+62 817 110 190',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.7418,108.5524',
        latitude: -6.7418,
        longitude: 108.5524,
        displayOrder: 8,
      },
      {
        name: 'Eyesoul Living Plaza Hertasning',
        address:
          'Living Plaza Hertasning, Lt. GF, Jl. Tun Abdul Razak, Tombolo, Gowa, Sulawesi Selatan 90233',
        province: 'Sulawesi Selatan',
        phone: '+62 817 110 773',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-5.1764,119.4443',
        latitude: -5.1764,
        longitude: 119.4443,
        displayOrder: 9,
      },
      {
        name: 'Eyesoul Living World Pekanbaru',
        address:
          'Living World Pekanbaru, Lt. UG, Jl. Soekarno-Hatta, Marpoyan Damai, Pekanbaru, Riau 28292',
        province: 'Riau',
        phone: '+62 811 110 0249',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=0.4998,101.4243',
        latitude: 0.4998,
        longitude: 101.4243,
        displayOrder: 10,
      },
      {
        name: 'Eyesoul Plaza IBCC Bandung',
        address:
          'Plaza IBCC, Lt. GF, Jl. Jendral Ahmad Yani No. 296, Kacapiring, Bandung, Jawa Barat 40271',
        province: 'Jawa Barat',
        phone: '+62 817 110 075',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.9159,107.6366',
        latitude: -6.9159,
        longitude: 107.6366,
        displayOrder: 11,
      },
      {
        name: 'Eyesoul Living Plaza Sawojajar',
        address:
          'Living Plaza Sawojajar, Lt. GF, Jl. Danau Toba No. 5, Madyopuro, Malang, Jawa Timur 65139',
        province: 'Jawa Timur',
        phone: '+62 811 110 0237',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-7.9734,112.6599',
        latitude: -7.9734,
        longitude: 112.6599,
        displayOrder: 12,
      },
      {
        name: 'Eyesoul Living Plaza Perintis',
        address:
          'Living Plaza Perintis, Lt. GF, Jl. Perintis Kemerdekaan KM 9, Tamalanrea Jaya, Makassar, Sulawesi Selatan 90245',
        province: 'Sulawesi Selatan',
        phone: '+62 818 110 166',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-5.1328,119.4923',
        latitude: -5.1328,
        longitude: 119.4923,
        displayOrder: 13,
      },
      {
        name: 'Eyesoul Living Plaza Ahmad Yani Bekasi',
        address:
          'Living Plaza AYB, Lt. GF, Jl. Jend. Ahmad Yani No. 9, Pekayon Jaya, Bekasi, Jawa Barat 17148',
        province: 'Jawa Barat',
        phone: '+62 817 110 600',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.2486,106.9918',
        latitude: -6.2486,
        longitude: 106.9918,
        displayOrder: 14,
      },
      {
        name: 'Eyesoul Living Plaza Paskal',
        address:
          'Living Plaza Pasir Kaliki (Paskal), Lt. GF, Jl. Pasir Kaliki No. 134, Cicendo, Bandung, Jawa Barat 40173',
        province: 'Jawa Barat',
        phone: '+62 817 110 076',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.9152,107.5962',
        latitude: -6.9152,
        longitude: 107.5962,
        displayOrder: 15,
      },
      {
        name: 'Eyesoul Living World Denpasar',
        address:
          'Living World Denpasar, Lt. 1, Jl. Gatot Subroto Timur, Tonja, Denpasar Utara, Bali 80237',
        province: 'Bali',
        phone: '+62 817 110 214',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-8.6364,115.2173',
        latitude: -8.6364,
        longitude: 115.2173,
        displayOrder: 16,
      },
      {
        name: 'Eyesoul Living World Kota Wisata',
        address:
          'Living World Kota Wisata, Lt. 2, Ciangsana, Kec. Gunung Putri, Bogor, Jawa Barat 16968',
        province: 'Jawa Barat',
        phone: '+62 817 110 603',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.3475,106.9631',
        latitude: -6.3475,
        longitude: 106.9631,
        displayOrder: 17,
      },
      {
        name: 'Eyesoul The Park Pejaten',
        address:
          'The Park Pejaten, Jl. Warung Jati Barat No. 39, Jati Padang, Pasar Minggu, Jakarta Selatan, DKI Jakarta 12540',
        province: 'DKI Jakarta',
        phone: '+62 817 110 603',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.2844,106.8277',
        latitude: -6.2844,
        longitude: 106.8277,
        displayOrder: 18,
      },
      {
        name: 'Eyesoul Living Plaza Bintaro',
        address:
          'Living Plaza Bintaro, Lt. 1, Jl. Bintaro Utama 9, Pondok Jaya, Pondok Aren, Tangerang Selatan, Banten 15229',
        province: 'Banten',
        phone: '+62 817 110 603',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.2801,106.7279',
        latitude: -6.2801,
        longitude: 106.7279,
        displayOrder: 19,
      },
      {
        name: 'Eyesoul Citimall Garut',
        address:
          'Citimall Garut, Lt. G, Jl. Jendral Sudirman No. 31, Sucikaler, Garut, Jawa Barat 44182',
        province: 'Jawa Barat',
        phone: '+62 811 110 0223',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-7.2148,107.9079',
        latitude: -7.2148,
        longitude: 107.9079,
        displayOrder: 20,
      },
      {
        name: 'Eyesoul Living Plaza Pettarani',
        address:
          'Living Plaza Pettarani, Jl. A. P. Pettarani Kav. 1, Tidung, Rappocini, Makassar, Sulawesi Selatan 90222',
        province: 'Sulawesi Selatan',
        phone: '+62 817 110 782',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-5.1614,119.4357',
        latitude: -5.1614,
        longitude: 119.4357,
        displayOrder: 21,
      },
      {
        name: 'Eyesoul Living World Grand Wisata',
        address:
          'Living World Grand Wisata, Lt. 1, Jl. Esplanade Avenue No. 11, Lambangjaya, Bekasi, Jawa Barat 17510',
        province: 'Jawa Barat',
        phone: '+62 811 110 0223',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.2758,107.0395',
        latitude: -6.2758,
        longitude: 107.0395,
        displayOrder: 22,
      },
      {
        name: 'Eyesoul Living Plaza Banjarmasin',
        address:
          'Living Plaza Banjarmasin, Jl. A. Yani KM 9, Mandar Sari, Kertak Hanyar, Banjar, Kalimantan Selatan 70654',
        province: 'Kalimantan Selatan',
        phone: '+62 817 110 133',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-3.3685,114.6291',
        latitude: -3.3685,
        longitude: 114.6291,
        displayOrder: 23,
      },
      {
        name: 'Eyesoul Cihampelas Walk',
        address:
          'Cihampelas Walk, Lt. LG, Jl. Cihampelas No. 160, Cipaganti, Coblong, Bandung, Jawa Barat 40131',
        province: 'Jawa Barat',
        phone: '+62 817 110 078',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.8938,107.6053',
        latitude: -6.8938,
        longitude: 107.6053,
        displayOrder: 24,
      },
      {
        name: 'Eyesoul Living Plaza Puri',
        address:
          'Living Plaza Puri, Jl. Puri Harum No. 2, Kembangan Selatan, Jakarta Barat, DKI Jakarta 11610',
        province: 'DKI Jakarta',
        phone: '+62 817 110 595',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-6.1895,106.7456',
        latitude: -6.1895,
        longitude: 106.7456,
        displayOrder: 25,
      },
      {
        name: 'Eyesoul Living Plaza Palu',
        address:
          'Living Plaza Palu, Jl. Prof. Moh. Yamin, Palu Selatan, Palu, Sulawesi Tengah 94111',
        province: 'Sulawesi Tengah',
        phone: '+62 811 110 0250',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=-0.9169,119.8858',
        latitude: -0.9169,
        longitude: 119.8858,
        displayOrder: 26,
      },
      {
        name: 'Eyesoul Living Plaza Batam',
        address:
          'Living Plaza Batam (ex Fanindo), Jl. Nadim, Belian, Batam Kota, Kepulauan Riau 29464',
        province: 'Kepulauan Riau',
        phone: '+62 811 110 0260',
        email: 'cs@eyesouleyewear.co.id',
        hoursWeekdays: 'Mon - Fri: 10:00am - 10:00pm',
        hoursSaturday: 'Saturday: 10:00am - 10:00pm',
        hoursSunday: 'Sunday: 10:00am - 10:00pm',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=1.1299,104.0370',
        latitude: 1.1299,
        longitude: 104.037,
        displayOrder: 27,
      },
    ]

    let storeLocationCount = 0
    for (let i = 0; i < storeLocations.length; i++) {
      const location = storeLocations[i]
      try {
        await prisma.storeLocation.create({
          data: {
            ...location,
            imageUrl: location.imageUrl || getPlaceholderImage(i),
          },
        })
        console.log(`  ✓ Created store location: ${location.name}`)
        storeLocationCount++
      } catch (error) {
        console.error(`  ❌ Error seeding store location ${location.name}:`, error)
      }
    }
    console.log(
      `✅ Seeded ${storeLocationCount}/${storeLocations.length} store locations successfully\n`,
    )
  }

  // Get final counts
  const [
    finalProductCount,
    finalBlogCount,
    finalTestimonialCount,
    finalStoreLocationCount,
    finalHeroSlideCount,
    finalTagCount,
  ] = await Promise.all([
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
