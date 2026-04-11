import { isAdmin } from '../access/isAdmin.js'

export const Users = {
  slug: 'users',
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: async ({ req }) => {
      if (req.user?.role === 'admin') return true
      const { totalDocs } = await req.payload.count({ collection: 'users', req })
      return totalDocs === 0
    },
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      required: true,
      access: {
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
}
