import { isStaff, staffOrPublished } from '../access/content.js'

export const ContactSubmissions = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'submissionStatus', 'createdAt'],
    description: 'Inbound contact form submissions from the storefront.',
  },
  versions: {
    drafts: true,
  },
  access: {
    create: () => true,
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
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'inquiryType',
      type: 'select',
      options: [
        { label: 'General Inquiry', value: 'general' },
        { label: 'Book Appointment', value: 'appointment' },
        { label: 'Order Support', value: 'support' },
        { label: 'Feedback', value: 'feedback' },
      ],
      defaultValue: 'general',
    },
    {
      name: 'preferredDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyy',
        },
      },
    },
    {
      name: 'honeypotTriggered',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'ipHash',
      type: 'text',
      index: true,
      admin: {
        description: 'SHA-256 hash of requester IP (never store raw IP).',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
    },
    {
      name: 'submissionStatus',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Spam', value: 'spam' },
      ],
      index: true,
    },
    {
      name: 'handledBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
