import { cache } from 'react'

import { getPayload, type Payload } from 'payload'

import config from '@payload-config'

type PayloadPromise = Promise<Payload>

const globalForPayload = globalThis as typeof globalThis & {
  __eyesoulPayloadPromise?: PayloadPromise
}

async function resolvePayload(): Promise<Payload> {
  if (process.env.NODE_ENV !== 'production') {
    if (!globalForPayload.__eyesoulPayloadPromise) {
      globalForPayload.__eyesoulPayloadPromise = getPayload({ config })
    }
    return globalForPayload.__eyesoulPayloadPromise
  }
  return getPayload({ config })
}

/**
 * Single Payload Local API instance per request (React `cache`) and one shared
 * promise in development to reduce duplicate connections during HMR.
 */
export const getPayloadInstance = cache(resolvePayload)
