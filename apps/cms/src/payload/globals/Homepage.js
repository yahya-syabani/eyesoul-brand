import { isStaff } from '../access/content.js'

export const Homepage = {
  slug: 'homepage',
  label: 'Homepage',
  access: {
    read: () => true,
    update: isStaff,
  },
  fields: [
    {
      name: 'modules',
      type: 'blocks',
      minRows: 0,
      labels: {
        singular: 'Module',
        plural: 'Modules',
      },
      blocks: [
        {
          slug: 'heroModule',
          labels: { singular: 'Hero', plural: 'Hero modules' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'heading', type: 'text', required: true },
            { name: 'subheading', type: 'textarea' },
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'ctaLabel', type: 'text' },
            { name: 'ctaHref', type: 'text' },
          ],
        },
        {
          slug: 'collectionSpotlight',
          labels: { singular: 'Collection spotlight', plural: 'Collection spotlights' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'subHeading', type: 'text' },
            {
              name: 'collections',
              type: 'relationship',
              relationTo: 'product-collections',
              hasMany: true,
              minRows: 1,
            },
          ],
        },
        {
          slug: 'productRow',
          labels: { singular: 'Product row', plural: 'Product rows' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'subHeading', type: 'text' },
            {
              name: 'products',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              minRows: 1,
            },
          ],
        },
        {
          slug: 'journalFeature',
          labels: { singular: 'Journal feature', plural: 'Journal features' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'subHeading', type: 'text' },
            {
              name: 'posts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              minRows: 1,
            },
          ],
        },
        {
          slug: 'seasonalBanner',
          labels: { singular: 'Seasonal banner', plural: 'Seasonal banners' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'body', type: 'textarea' },
            { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
            { name: 'linkLabel', type: 'text' },
            { name: 'linkHref', type: 'text' },
          ],
        },
      ],
    },
  ],
}
