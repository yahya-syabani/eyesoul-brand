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
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'core_service',
      options: [
        { label: 'Core Service', value: 'core_service' },
        { label: 'Premium Benefit', value: 'premium_benefit' },
      ],
      admin: {
        position: 'sidebar',
      },
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
        { label: 'Guarantee', value: 'guarantee' },
        { label: 'Trade-In', value: 'trade-in' },
        { label: 'Benefit', value: 'benefit' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Large background image for the detail page hero section.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              admin: {
                description: 'Main body content for the service detail page.',
              },
            },
          ],
        },
        {
          label: 'Process',
          fields: [
            {
              name: 'processSteps',
              type: 'array',
              label: 'How It Works',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'FAQs',
          fields: [
            {
              name: 'faqs',
              type: 'array',
              label: 'Frequently Asked Questions',
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
