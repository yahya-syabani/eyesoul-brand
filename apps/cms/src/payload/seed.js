import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'

import config from '../../payload.config.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** 1x1 PNG */
const PLACEHOLDER_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

const lexicalParagraph = (text) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
})

function ensurePlaceholderFile() {
  const dir = path.join(__dirname, 'seed-assets')
  const dest = path.join(dir, 'placeholder.png')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, Buffer.from(PLACEHOLDER_B64, 'base64'))
  }
  return dest
}

async function ensureSeedMedia(payload) {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: 'Seed catalog placeholder' } },
    limit: 1,
  })
  if (existing.docs[0]) return existing.docs[0].id

  const doc = await payload.create({
    collection: 'media',
    data: { alt: 'Seed catalog placeholder' },
    filePath: ensurePlaceholderFile(),
  })
  return doc.id
}

async function upsertBySlug(payload, collection, slug, data) {
  const found = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    draft: true,
  })
  if (found.docs[0]) {
    await payload.update({
      collection,
      id: found.docs[0].id,
      data,
      draft: false,
    })
    return found.docs[0].id
  }
  const doc = await payload.create({
    collection,
    data,
    draft: false,
  })
  return doc.id
}

async function seed() {
  const payload = await getPayload({ config })

  const mediaId = await ensureSeedMedia(payload)

  const collectionId = await upsertBySlug(payload, 'product-collections', 'featured', {
    title: 'Featured',
    slug: 'featured',
    description: 'Baseline collection for Phase-1 catalog.',
    displayOrder: 0,
    featured: true,
    coverImage: mediaId,
  })

  const productId = await upsertBySlug(payload, 'products', 'sample-frame', {
    name: 'Sample Frame',
    slug: 'sample-frame',
    description: lexicalParagraph('Sample eyewear for catalog preview (EP-1 seed).'),
    price: 129,
    availabilityStatus: 'in-stock',
    images: [mediaId],
    collection: collectionId,
    specs: {
      showSpecsOnPdp: true,
      bridgeMm: 18,
      templeMm: 145,
      lensWidthMm: 52,
      lensHeightMm: 42,
      lensType: 'single-vision',
      lensMaterial: 'polycarbonate',
      lensTreatment: 'anti-reflective',
      frameMaterial: 'acetate',
      fitNotes: 'Medium fit for most adults.',
      faceShapeHints: 'Oval, heart',
    },
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
  })

  await upsertBySlug(payload, 'stores', 'flagship-store', {
    name: 'Flagship Store',
    slug: 'flagship-store',
    address: '123 Example Street\nJakarta',
    city: 'Jakarta',
    region: 'Java',
    phone: '+62-21-0000-0000',
    whatsApp: 'https://wa.me/6281234567890',
    email: 'store@example.com',
    mapsUrl: 'https://maps.google.com',
    latitude: -6.2,
    longitude: 106.8,
    hours: [
      { day: 'mon', open: '10:00', close: '20:00' },
      { day: 'sat', open: '10:00', close: '18:00' },
    ],
  })

  await upsertBySlug(payload, 'services', 'eye-exam', {
    name: 'Eye exam',
    slug: 'eye-exam',
    description: 'Comprehensive vision screening and prescription check.',
    icon: mediaId,
    displayOrder: 0,
    serviceType: 'exam',
    bookingUrl: 'https://cal.com',
    primaryCtaLabel: 'Book eye exam',
  })

  await upsertBySlug(payload, 'pages', 'about', {
    title: 'About',
    slug: 'about',
    blocks: [
      {
        blockType: 'hero',
        heading: 'About Eyesoul',
        subheading: 'Crafted eyewear for everyday clarity.',
        image: mediaId,
      },
      {
        blockType: 'content',
        body: lexicalParagraph(
          'This is seeded content from EP-1. Replace with your brand story in the admin.',
        ),
      },
      {
        blockType: 'faq',
        heading: 'Common questions',
        items: [
          {
            question: 'Do you offer eye exams?',
            answer: 'Yes — book an exam at one of our locations or use the booking link on the Services page.',
          },
          {
            question: 'What is your return policy?',
            answer: 'Contact the store where you purchased for returns and exchanges. Policies may vary by region.',
          },
        ],
      },
    ],
  })

  await upsertBySlug(payload, 'pages', 'contact', {
    title: 'Contact',
    slug: 'contact',
    blocks: [
      {
        blockType: 'content',
        body: lexicalParagraph('Reach us via the contact form or visit a store. (EP-1 seed)'),
      },
      {
        blockType: 'cta',
        label: 'WhatsApp',
        href: 'https://wa.me/6281234567890',
      },
    ],
  })

  const postId = await upsertBySlug(payload, 'posts', 'how-to-choose-eyewear', {
    title: 'How to choose eyewear for daily comfort',
    slug: 'how-to-choose-eyewear',
    excerpt: 'A practical guide to frame fit, lens choices, and comfort for all-day wear.',
    content: lexicalParagraph('Use this seed article as a baseline and replace with editorial content in admin.'),
    featuredImage: mediaId,
    category: 'Guides',
    authorName: 'Eyesoul Editorial Team',
    authorBio: 'Writers and optician collaborators at Eyesoul.',
    authorAvatar: mediaId,
    timeToRead: '4 min read',
  })

  const existingReview = await payload.find({
    collection: 'product-reviews',
    where: { product: { equals: productId } },
    limit: 1,
    draft: true,
  })
  if (!existingReview.docs[0]) {
    await payload.create({
      collection: 'product-reviews',
      data: {
        product: productId,
        rating: 5,
        title: 'Clear lenses, comfortable fit',
        body: lexicalParagraph('Lightweight frame and sharp optics — great for daily wear.'),
        authorName: 'Seed Customer',
        verified: true,
        _status: 'published',
      },
      draft: false,
    })
  }

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      modules: [
        {
          blockType: 'heroModule',
          eyebrow: 'New season',
          heading: 'Clarity in every frame',
          subheading: 'Eyewear and vision care, crafted for daily life.',
          image: mediaId,
          ctaLabel: 'Shop catalog',
          ctaHref: '/catalog',
        },
        {
          blockType: 'collectionSpotlight',
          heading: 'Shop by collection',
          subHeading: 'Explore by style',
          collections: [collectionId],
        },
        {
          blockType: 'productRow',
          heading: 'Featured frames',
          subHeading: 'Bestsellers from the seed catalog',
          products: [productId],
        },
        {
          blockType: 'journalFeature',
          heading: 'From the journal',
          subHeading: 'Guides and stories',
          posts: [postId],
        },
      ],
    },
  })

  payload.logger.info('EP-1 seed completed.')
}

await seed()
process.exit(0)
