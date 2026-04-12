import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const src = resolve(root, 'apps/cms/src/payload-types.ts')
const dest = resolve(root, 'src/payload-types.ts')

copyFileSync(src, dest)
console.log('Synced apps/cms/src/payload-types.ts -> src/payload-types.ts')
