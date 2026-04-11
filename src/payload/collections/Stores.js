import { isStaff, staffOrPublished } from '../access/content.js'
import { normalizeSlug } from '../utils/slug.js'

export const Stores = {
  slug: 'stores',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'updatedAt'],
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
      name: 'address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'E.164 or local format as you prefer.',
      },
    },
    {
      name: 'whatsApp',
      type: 'text',
      admin: {
        description: 'Full WhatsApp link, e.g. https://wa.me/6281234567890',
      },
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'mapsUrl',
      type: 'text',
      admin: {
        description: 'Google Maps (or other) URL for directions.',
      },
    },
    {
      name: 'latitude',
      type: 'number',
    },
    {
      name: 'longitude',
      type: 'number',
    },
    {
      name: 'hours',
      type: 'array',
      labels: {
        singular: 'Hours row',
        plural: 'Operating hours',
      },
      fields: [
        {
          name: 'day',
          type: 'select',
          required: true,
          options: [
            { label: 'Monday', value: 'mon' },
            { label: 'Tuesday', value: 'tue' },
            { label: 'Wednesday', value: 'wed' },
            { label: 'Thursday', value: 'thu' },
            { label: 'Friday', value: 'fri' },
            { label: 'Saturday', value: 'sat' },
            { label: 'Sunday', value: 'sun' },
          ],
        },
        {
          name: 'open',
          type: 'text',
          admin: { description: 'e.g. 09:00' },
        },
        {
          name: 'close',
          type: 'text',
          admin: { description: 'e.g. 21:00' },
        },
      ],
    },
  ],
}
