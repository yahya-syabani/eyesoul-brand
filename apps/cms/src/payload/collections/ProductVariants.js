import { isStaff, staffOrPublished } from '../access/content.js'

export const ProductVariants = {
  slug: 'product-variants',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'product', 'sku', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    create: isStaff,
    delete: isStaff,
    read: staffOrPublished,
    update: isStaff,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. Matte Black / 52-18-145' },
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      index: true,
      admin: { description: 'Optional internal SKU for this specific variant.' },
    },
    {
      name: 'gtin',
      type: 'text',
      admin: { description: 'Optional GTIN/EAN/UPC for this variant.' },
    },
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      minRows: 0,
      admin: { description: 'Variant-specific images (falls back to product images if empty).' },
    },
    {
      name: 'attributes',
      type: 'group',
      fields: [
        { name: 'colorName', type: 'text' },
        { name: 'colorCode', type: 'text' },
        { name: 'lensWidthMm', type: 'number', min: 0, max: 200 },
        { name: 'bridgeMm', type: 'number', min: 0, max: 200 },
        { name: 'templeMm', type: 'number', min: 0, max: 200 },
      ],
    },
  ],
}

