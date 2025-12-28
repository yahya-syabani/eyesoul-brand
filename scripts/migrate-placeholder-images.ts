import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PLACEHOLDER_PATTERNS = [
  '/images/product/1000x1000.png',
  '/images/store-location/store1.png',
  '/images/slider/bg7-1.png',
  '/images/banner/1.png',
  '/images/banner/2.png',
  '/images/banner/3.png',
  '/images/banner/4.png',
  '/images/banner/5.png',
  '/images/banner/6.png',
  '/images/banner/7.png',
  '/images/banner/8.png',
  '/images/banner/9.png',
  '/images/banner/10.png',
]

async function main() {
  console.log('🔍 Scanning for placeholder images...\n')

  // Check Products
  const products = await prisma.product.findMany({
    include: { variations: true },
  })

  const productsWithPlaceholders = products.filter((product) => {
    const hasPlaceholderImages = product.images.some((img) =>
      PLACEHOLDER_PATTERNS.includes(img)
    )
    const hasPlaceholderThumbs = product.thumbImages.some((img) =>
      PLACEHOLDER_PATTERNS.includes(img)
    )
    const hasPlaceholderVariations = product.variations.some(
      (v) => v.image && PLACEHOLDER_PATTERNS.includes(v.image)
    )
    return hasPlaceholderImages || hasPlaceholderThumbs || hasPlaceholderVariations
  })

  // Check Store Locations
  const storeLocations = await prisma.storeLocation.findMany()
  const storesWithPlaceholders = storeLocations.filter(
    (store) => store.imageUrl && PLACEHOLDER_PATTERNS.includes(store.imageUrl)
  )

  // Check Hero Slides
  const heroSlides = await prisma.heroSlide.findMany()
  const slidesWithPlaceholders = heroSlides.filter(
    (slide) => slide.imageUrl && PLACEHOLDER_PATTERNS.includes(slide.imageUrl)
  )

  // Check Blogs
  const blogs = await prisma.blog.findMany()
  const blogsWithPlaceholders = blogs.filter(
    (blog) =>
      (blog.thumbImg && PLACEHOLDER_PATTERNS.includes(blog.thumbImg)) ||
      (blog.coverImg && PLACEHOLDER_PATTERNS.includes(blog.coverImg)) ||
      blog.subImg.some((img) => PLACEHOLDER_PATTERNS.includes(img))
  )

  // Check Testimonials
  const testimonials = await prisma.testimonial.findMany()
  const testimonialsWithPlaceholders = testimonials.filter(
    (testimonial) =>
      (testimonial.avatar && PLACEHOLDER_PATTERNS.includes(testimonial.avatar)) ||
      testimonial.images.some((img) => PLACEHOLDER_PATTERNS.includes(img))
  )

  // Generate Report
  console.log('📊 Placeholder Image Report\n')
  console.log('=' .repeat(50))
  console.log(`Products with placeholders: ${productsWithPlaceholders.length}`)
  if (productsWithPlaceholders.length > 0) {
    productsWithPlaceholders.forEach((p) => {
      console.log(`  - ${p.name} (ID: ${p.id})`)
    })
  }

  console.log(`\nStore Locations with placeholders: ${storesWithPlaceholders.length}`)
  if (storesWithPlaceholders.length > 0) {
    storesWithPlaceholders.forEach((s) => {
      console.log(`  - ${s.name} (ID: ${s.id})`)
    })
  }

  console.log(`\nHero Slides with placeholders: ${slidesWithPlaceholders.length}`)
  if (slidesWithPlaceholders.length > 0) {
    slidesWithPlaceholders.forEach((s) => {
      console.log(`  - ${s.title} (ID: ${s.id})`)
    })
  }

  console.log(`\nBlogs with placeholders: ${blogsWithPlaceholders.length}`)
  if (blogsWithPlaceholders.length > 0) {
    blogsWithPlaceholders.forEach((b) => {
      console.log(`  - ${b.title} (ID: ${b.id})`)
    })
  }

  console.log(`\nTestimonials with placeholders: ${testimonialsWithPlaceholders.length}`)
  if (testimonialsWithPlaceholders.length > 0) {
    testimonialsWithPlaceholders.forEach((t) => {
      console.log(`  - ${t.name} (ID: ${t.id})`)
    })
  }

  const total = productsWithPlaceholders.length + storesWithPlaceholders.length + slidesWithPlaceholders.length + blogsWithPlaceholders.length + testimonialsWithPlaceholders.length

  console.log('\n' + '='.repeat(50))
  console.log(`Total entities with placeholder images: ${total}`)
  console.log('\n💡 Next steps:')
  console.log('   1. Upload real images using the admin interface')
  console.log('   2. Replace placeholder URLs with uploaded image paths')
  console.log('   3. Run this script again to verify all placeholders are replaced')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

