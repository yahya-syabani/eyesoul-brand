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

  await upsertBySlug(payload, 'products', 'sample-frame', {
    name: 'Sample Frame',
    slug: 'sample-frame',
    description: lexicalParagraph('Sample eyewear for catalog preview (EP-1 seed).'),
    price: 129,
    availabilityStatus: 'in-stock',
    images: [mediaId],
    collection: collectionId,
  })

  await upsertBySlug(payload, 'stores', 'flagship-store', {
    name: 'Flagship Store',
    slug: 'flagship-store',
    address: '123 Example Street\nJakarta',
    city: 'Jakarta',
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

  await upsertBySlug(payload, 'posts', 'how-to-choose-eyewear', {
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

  payload.logger.info('EP-1 seed completed.')
}

await seed()
process.exit(0)
