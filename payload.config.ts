import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'

import { Media } from './src/payload/collections/Media.js'
import { Users } from './src/payload/collections/Users.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const requiredEnv = (name) => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  db: postgresAdapter({
    pool: {
      connectionString: requiredEnv('DATABASE_URI'),
    },
  }),
  secret: requiredEnv('PAYLOAD_SECRET'),
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
