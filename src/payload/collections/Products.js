import { isStaff, staffOrPublished } from '../access/content.js'
import { standardLexicalEditor } from '../lexical/editor.js'
import { normalizeSlug } from '../utils/slug.js'

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
  ],
}
