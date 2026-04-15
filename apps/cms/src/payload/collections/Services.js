import { isStaff, staffOrPublished } from '../access/content.js'
import { normalizeSlug } from '../utils/slug.js'

export const Services = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'displayOrder', 'updatedAt'],
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
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'serviceType',
      type: 'select',
      required: true,
      defaultValue: 'other',
      options: [
        { label: 'Exam', value: 'exam' },
        { label: 'Fitting', value: 'fitting' },
        { label: 'Adjustments', value: 'adjustments' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'bookingUrl',
      type: 'text',
      admin: {
        description: 'Optional Cal.com, Google Appointments, or other booking link.',
      },
    },
    {
      name: 'bookingPhone',
      type: 'text',
      admin: {
        description: 'Optional phone for booking when no URL is set.',
      },
    },
    {
      name: 'primaryCtaLabel',
      type: 'text',
      defaultValue: 'Book appointment',
    },
  ],
}
