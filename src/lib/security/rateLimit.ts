type RateLimitState = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  allowed: boolean
  retryAfterMs: number
  remaining: number
}

const store = new Map<string, RateLimitState>()

export function checkRateLimit(key: string, options?: { windowMs?: number; maxRequests?: number }): RateLimitResult {
  const windowMs = options?.windowMs ?? 10 * 60 * 1000
  const maxRequests = options?.maxRequests ?? 5
  const now = Date.now()

  const existing = store.get(key)
  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return {
      allowed: true,
      retryAfterMs: 0,
      remaining: Math.max(0, maxRequests - 1),
    }
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterMs: Math.max(0, existing.resetAt - now),
      remaining: 0,
    }
  }

  existing.count += 1
  store.set(key, existing)
  return {
    allowed: true,
    retryAfterMs: 0,
    remaining: Math.max(0, maxRequests - existing.count),
  }
}
