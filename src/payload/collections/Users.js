import { isAdmin } from '../access/isAdmin.js'

export const Users = {
  slug: 'users',
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: isAdmin,
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
    },
  ],
}
