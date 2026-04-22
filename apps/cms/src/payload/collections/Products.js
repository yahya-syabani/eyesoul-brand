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
    defaultColumns: ['name', 'slug', 'productType', 'collections', 'updatedAt'],
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
      name: 'productType',
      type: 'select',
      required: true,
      defaultValue: 'optical-frame',
      options: [
        { label: 'Optical frames', value: 'optical-frame' },
        { label: 'Sunglasses', value: 'sunglasses' },
        { label: 'Soft contact lenses', value: 'contact-soft' },
        { label: 'Contact lens care products', value: 'contact-care' },
        { label: 'Accessories', value: 'accessory' },
      ],
      admin: {
        description: 'High-level product line for storefront navigation and filtering.',
      },
    },
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
      name: 'brand',
      type: 'text',
      admin: { description: 'Brand label shown on PDP and used in filtering.' },
    },
    {
      name: 'gtin',
      type: 'text',
      admin: { description: 'Optional GTIN/EAN/UPC for retail/integrations.' },
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
      name: 'collections',
      type: 'relationship',
      relationTo: 'product-collections',
      hasMany: true,
      required: false,
      admin: {
        description: 'Editorial groupings (multi-select). Used for /collections pages and collection filters.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Merchandising flag (e.g. homepage rows).' },
    },
    {
      name: 'badges',
      type: 'json',
      admin: {
        description:
          'Optional list of badge strings, e.g. ["new","bestseller"]. Kept as JSON to avoid extra join tables in Phase 1.',
      },
    },
    {
      name: 'frame',
      type: 'group',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.productType === 'optical-frame' || siblingData?.productType === 'sunglasses',
      },
      fields: [
        {
          name: 'frameShape',
          type: 'select',
          options: [
            { label: 'Round', value: 'round' },
            { label: 'Rectangle', value: 'rectangle' },
            { label: 'Square', value: 'square' },
            { label: 'Aviator', value: 'aviator' },
            { label: 'Cat-eye', value: 'cat-eye' },
            { label: 'Browline', value: 'browline' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'rimType',
          type: 'select',
          options: [
            { label: 'Full rim', value: 'full-rim' },
            { label: 'Semi-rimless', value: 'semi-rimless' },
            { label: 'Rimless', value: 'rimless' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'frameColor',
          type: 'text',
        },
        {
          name: 'rxAble',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'lensColor',
          type: 'text',
          admin: { condition: (_, siblingData) => siblingData?.productType === 'sunglasses' },
        },
        {
          name: 'polarized',
          type: 'checkbox',
          defaultValue: false,
          admin: { condition: (_, siblingData) => siblingData?.productType === 'sunglasses' },
        },
        {
          name: 'uv400',
          type: 'checkbox',
          defaultValue: false,
          admin: { condition: (_, siblingData) => siblingData?.productType === 'sunglasses' },
        },
        {
          name: 'lensCategory',
          type: 'number',
          min: 0,
          max: 4,
          admin: { condition: (_, siblingData) => siblingData?.productType === 'sunglasses' },
        },
      ],
    },
    {
      name: 'specs',
      type: 'group',
      label: 'Fit & lens specs',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.productType === 'optical-frame' || siblingData?.productType === 'sunglasses',
      },
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
      name: 'contactLens',
      type: 'group',
      admin: { condition: (_, siblingData) => siblingData?.productType === 'contact-soft' },
      fields: [
        {
          name: 'replacementSchedule',
          type: 'select',
          options: [
            { label: 'Daily', value: 'daily' },
            { label: 'Biweekly', value: 'biweekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Other', value: 'other' },
          ],
        },
        { name: 'unitsPerBox', type: 'number', min: 1 },
        {
          name: 'baseCurveOptionsMm',
          type: 'json',
          admin: { description: 'JSON array of numbers, e.g. [8.4, 8.8]' },
        },
        {
          name: 'diameterOptionsMm',
          type: 'json',
          admin: { description: 'JSON array of numbers, e.g. [14.0, 14.2]' },
        },
        {
          name: 'spherePowerRange',
          type: 'group',
          fields: [
            { name: 'min', type: 'number' },
            { name: 'max', type: 'number' },
            { name: 'step', type: 'number', min: 0 },
          ],
        },
        {
          name: 'hasCylinder',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'cylinderPowerRange',
          type: 'group',
          admin: { condition: (_, siblingData) => !!siblingData?.contactLens?.hasCylinder },
          fields: [
            { name: 'min', type: 'number' },
            { name: 'max', type: 'number' },
            { name: 'step', type: 'number', min: 0 },
          ],
        },
        {
          name: 'axisStep',
          type: 'number',
          admin: { condition: (_, siblingData) => !!siblingData?.contactLens?.hasCylinder },
        },
        {
          name: 'hasAdd',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'addPowerRange',
          type: 'group',
          admin: { condition: (_, siblingData) => !!siblingData?.contactLens?.hasAdd },
          fields: [
            { name: 'min', type: 'number' },
            { name: 'max', type: 'number' },
            { name: 'step', type: 'number', min: 0 },
          ],
        },
        {
          name: 'materialType',
          type: 'select',
          options: [
            { label: 'Hydrogel', value: 'hydrogel' },
            { label: 'Silicone hydrogel', value: 'silicone-hydrogel' },
            { label: 'Other', value: 'other' },
          ],
        },
        { name: 'waterContentPercent', type: 'number', min: 0, max: 100 },
        { name: 'dkT', type: 'number', min: 0, admin: { description: 'Oxygen transmissibility (Dk/t), if known.' } },
        {
          name: 'wearingModality',
          type: 'select',
          options: [
            { label: 'Daily wear', value: 'daily-wear' },
            { label: 'Extended wear', value: 'extended-wear' },
          ],
        },
      ],
    },
    {
      name: 'careProduct',
      type: 'group',
      admin: { condition: (_, siblingData) => siblingData?.productType === 'contact-care' },
      fields: [
        {
          name: 'unitOfMeasure',
          type: 'select',
          options: [
            { label: 'Bottle', value: 'bottle' },
            { label: 'Box', value: 'box' },
            { label: 'Pack', value: 'pack' },
            { label: 'Other', value: 'other' },
          ],
        },
        { name: 'unitVolumeMl', type: 'number', min: 0, admin: { condition: (_, siblingData) => siblingData?.careProduct?.unitOfMeasure === 'bottle' } },
        { name: 'unitsPerPack', type: 'number', min: 1 },
        {
          name: 'compatibility',
          type: 'select',
          options: [
            { label: 'All contact lenses', value: 'all' },
            { label: 'Soft lenses only', value: 'soft-only' },
            { label: 'Other', value: 'other' },
          ],
        },
      ],
    },
    {
      name: 'accessory',
      type: 'group',
      admin: { condition: (_, siblingData) => siblingData?.productType === 'accessory' },
      fields: [
        {
          name: 'accessoryType',
          type: 'select',
          options: [
            { label: 'Case', value: 'case' },
            { label: 'Cloth', value: 'cloth' },
            { label: 'Chain', value: 'chain' },
            { label: 'Kit', value: 'kit' },
            { label: 'Other', value: 'other' },
          ],
        },
        { name: 'unitsPerPack', type: 'number', min: 1 },
        { name: 'compatibilityNotes', type: 'textarea' },
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
