import { isStaff, staffOrPublished } from '../access/content.js'
import { standardLexicalEditor } from '../lexical/editor.js'
import { normalizeSlug } from '../utils/slug.js'

export const Pages = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
      name: 'title',
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
            const raw = value || siblingData?.title || ''
            return normalizeSlug(String(raw))
          },
        ],
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      minRows: 1,
      blocks: [
        {
          slug: 'content',
          labels: {
            singular: 'Content',
            plural: 'Content blocks',
          },
          fields: [
            {
              name: 'body',
              type: 'richText',
              editor: standardLexicalEditor,
              required: true,
            },
          ],
        },
        {
          slug: 'hero',
          labels: {
            singular: 'Hero',
            plural: 'Hero blocks',
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'subheading',
              type: 'text',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          slug: 'cta',
          labels: {
            singular: 'CTA',
            plural: 'CTA blocks',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          slug: 'faq',
          labels: {
            singular: 'FAQ',
            plural: 'FAQ blocks',
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              admin: { description: 'Optional section title above the questions.' },
            },
            {
              name: 'items',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
