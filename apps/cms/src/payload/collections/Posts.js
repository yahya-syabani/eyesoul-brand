import { isStaff, staffOrPublished } from '../access/content.js'
import { standardLexicalEditor } from '../lexical/editor.js'
import { normalizeSlug } from '../utils/slug.js'

export const Posts = {
  slug: 'posts',
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
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 240,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: standardLexicalEditor,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'category',
      type: 'text',
      required: false,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorBio',
      type: 'textarea',
      required: false,
      maxLength: 300,
    },
    {
      name: 'authorAvatar',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'timeToRead',
      type: 'text',
      required: false,
      admin: {
        description: 'Example: 3 min read',
      },
    },
  ],
}
