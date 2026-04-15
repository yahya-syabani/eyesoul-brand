import { isStaff, staffOrPublished } from '../access/content.js'
import { standardLexicalEditor } from '../lexical/editor.js'
import { normalizeSlug } from '../utils/slug.js'

function normalizeOptionalUrl(value) {
  if (value == null) return ''
  const s = String(value).trim()
  return s
}

function validateVideoUrl(value) {
  const s = normalizeOptionalUrl(value)
  if (!s) return ''
  let u
  try {
    u = new URL(s)
  } catch {
    throw new Error('Video URL must be a valid http(s) URL (e.g. YouTube or Vimeo embed page).')
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error('Video URL must use http or https.')
  }
  const host = u.hostname.toLowerCase()
  const allowed =
    host.includes('youtube.com') ||
    host.includes('youtu.be') ||
    host.includes('vimeo.com') ||
    host.includes('player.vimeo.com')
  if (!allowed) {
    throw new Error('Video URL must be a YouTube or Vimeo link for v1.')
  }
  return s
}

export const Products = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'collection', 'updatedAt'],
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
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [
          ({ siblingData, value }) => {
            const raw = value || siblingData?.name || ''
            return normalizeSlug(String(raw))
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: standardLexicalEditor,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Display price (Phase 1 catalog only; no checkout).',
      },
    },
    {
      name: 'availabilityStatus',
      type: 'select',
      required: true,
      defaultValue: 'in-stock',
      options: [
        {
          label: 'In stock',
          value: 'in-stock',
        },
        {
          label: 'Available',
          value: 'available',
        },
      ],
      admin: {
        description: 'Catalog availability filter value for storefront search.',
      },
    },
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      minRows: 0,
    },
    {
      name: 'collection',
      type: 'relationship',
      relationTo: 'product-collections',
      required: false,
    },
    {
      name: 'specs',
      type: 'group',
      label: 'Fit & lens specs',
      fields: [
        {
          name: 'showSpecsOnPdp',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'When off, the storefront hides the specs module.' },
        },
        {
          name: 'bridgeMm',
          type: 'number',
          min: 0,
          max: 200,
          admin: { description: 'Bridge width (mm)' },
        },
        {
          name: 'templeMm',
          type: 'number',
          min: 0,
          max: 200,
          admin: { description: 'Temple length (mm)' },
        },
        {
          name: 'lensWidthMm',
          type: 'number',
          min: 0,
          max: 200,
        },
        {
          name: 'lensHeightMm',
          type: 'number',
          min: 0,
          max: 200,
        },
        {
          name: 'lensType',
          type: 'select',
          options: [
            { label: 'Single vision', value: 'single-vision' },
            { label: 'Progressive', value: 'progressive' },
            { label: 'Photochromic', value: 'photochromic' },
            { label: 'Polarized', value: 'polarized' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'lensMaterial',
          type: 'select',
          options: [
            { label: 'CR-39', value: 'cr39' },
            { label: 'Polycarbonate', value: 'polycarbonate' },
            { label: 'High index', value: 'high-index' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'lensTreatment',
          type: 'select',
          options: [
            { label: 'Anti-reflective', value: 'anti-reflective' },
            { label: 'Blue light', value: 'blue-light' },
            { label: 'UV', value: 'uv' },
            { label: 'Scratch resistant', value: 'scratch-resistant' },
            { label: 'None', value: 'none' },
          ],
        },
        {
          name: 'frameMaterial',
          type: 'select',
          options: [
            { label: 'Acetate', value: 'acetate' },
            { label: 'Metal', value: 'metal' },
            { label: 'Titanium', value: 'titanium' },
            { label: 'Mixed', value: 'mixed' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'fitNotes',
          type: 'textarea',
          admin: { description: 'Short notes on fit (e.g. narrow bridge).' },
        },
        {
          name: 'faceShapeHints',
          type: 'text',
          admin: { description: 'e.g. oval, heart — avoid color-only cues.' },
        },
        {
          name: 'dimensionDiagram',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description: 'YouTube or Vimeo page URL (no autoplay on storefront).',
      },
      hooks: {
        beforeValidate: [({ value }) => validateVideoUrl(value)],
      },
    },
    {
      name: 'videoPoster',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
