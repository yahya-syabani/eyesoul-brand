// @ts-nocheck — collection configs live in .js for Payload CLI; types are loose here.
import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './src/payload/collections/Media.js'
import { Pages } from './src/payload/collections/Pages.js'
import { ProductCollections } from './src/payload/collections/ProductCollections.js'
import { Products } from './src/payload/collections/Products.js'
import { Posts } from './src/payload/collections/Posts.js'
import { ProductReviews } from './src/payload/collections/ProductReviews.js'
import { Services } from './src/payload/collections/Services.js'
import { Stores } from './src/payload/collections/Stores.js'
import { Users } from './src/payload/collections/Users.js'
import { Homepage } from './src/payload/globals/Homepage.js'
import { standardLexicalEditor } from './src/payload/lexical/editor.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const requiredEnv = (name: string): string => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export default buildConfig({
  sharp,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    ProductCollections,
    Products,
    ProductReviews,
    Stores,
    Services,
    Pages,
    Posts,
  ],
  globals: [Homepage],
  db: postgresAdapter({
    pool: {
      connectionString: requiredEnv('DATABASE_URI'),
    },
  }),
  editor: standardLexicalEditor,
  plugins: [
    seoPlugin({
      collections: ['product-collections', 'products', 'stores', 'services', 'pages', 'posts'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        if (doc && typeof doc === 'object') {
          if ('title' in doc && doc.title) return String(doc.title)
          if ('name' in doc && doc.name) return String(doc.name)
        }
        return 'Eyesoul'
      },
      generateDescription: ({ doc }) => {
        if (doc && typeof doc === 'object' && 'description' in doc) {
          const text = doc.description
          if (typeof text === 'string') return text
        }
        return ''
      },
      generateImage: ({ doc }) => {
        if (!doc || typeof doc !== 'object') return undefined
        if ('coverImage' in doc && doc.coverImage) return doc.coverImage
        if ('icon' in doc && doc.icon) return doc.icon
        if ('images' in doc && Array.isArray(doc.images) && doc.images.length > 0) {
          return doc.images[0]
        }
        return undefined
      },
      generateURL: ({ doc, collectionConfig }) => {
        const slug =
          doc && typeof doc === 'object' && 'slug' in doc && typeof doc.slug === 'string'
            ? doc.slug
            : ''
        if (!slug) return ''
        // In split topology, canonical URLs must point to the storefront, not
        // the CMS server. NEXT_PUBLIC_STOREFRONT_URL is the storefront origin.
        const base = (process.env.NEXT_PUBLIC_STOREFRONT_URL ?? 'http://localhost:3000').replace(
          /\/$/,
          '',
        )
        const key = collectionConfig?.slug
        if (key === 'products') return `${base}/catalog/${slug}`
        if (key === 'product-collections') return `${base}/collections/${slug}`
        if (key === 'posts') return `${base}/journal/${slug}`
        if (key === 'pages') return `${base}/${slug}`
        if (key === 'stores') return `${base}/stores`
        if (key === 'services') return `${base}/services`
        return `${base}/${slug}`
      },
    }),
  ],
  secret: requiredEnv('PAYLOAD_SECRET'),
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
