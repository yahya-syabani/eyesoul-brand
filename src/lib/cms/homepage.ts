import type { Homepage } from '@/payload-types'

import { cmsGetGlobal } from './client'

export async function getHomepage(options: { depth?: number } = {}): Promise<Homepage | null> {
  return cmsGetGlobal<Homepage>('homepage', { depth: options.depth ?? 3 })
}
