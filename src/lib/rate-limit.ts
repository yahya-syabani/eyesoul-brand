import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { RATE_LIMIT_CONFIG } from './api-constants'

/**
 * Distributed rate limiter using Upstash Redis
 * Falls back to a simple in-memory limiter if Upstash is not configured (development)
 */

// Initialize Upstash Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// Initialize rate limiter instances
const createRatelimit = (limit: number, window: number) => {
  if (redis) {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${window} s`),
      analytics: true,
    })
  }
  return null
}

// Fallback in-memory rate limiter for development
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Clean up expired entries periodically (every 5 minutes)
 */
if (!redis) {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of Array.from(rateLimitStore.entries())) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

/**
 * Get client identifier from request (IP address)
 */
function getClientId(request: Request): string {
  // Try to get IP from various headers (for proxy/load balancer scenarios)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  // Fallback to a default identifier (in production, this should always be available)
  return request.headers.get('host') || 'unknown'
}

/**
 * Check rate limit for a request (fallback implementation for development)
 */
function checkRateLimitFallback(
  request: Request,
  limit: number,
  windowSeconds: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const clientId = getClientId(request)
  const now = Date.now()
  const key = `${clientId}:${limit}:${windowSeconds}`
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    const resetTime = now + windowSeconds * 1000
    rateLimitStore.set(key, { count: 1, resetTime })
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: resetTime,
    }
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetTime,
    }
  }

  // Increment count
  entry.count++
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt: entry.resetTime,
  }
}

/**
 * Check rate limit for a request
 * @param request - The incoming request
 * @param limit - Maximum number of requests allowed
 * @param windowSeconds - Time window in seconds
 * @returns Object with allowed status and remaining requests
 */
export async function checkRateLimit(
  request: Request,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  // Use Upstash Redis if configured, otherwise fallback to in-memory
  if (redis) {
    const ratelimit = createRatelimit(limit, windowSeconds)
    if (ratelimit) {
      const clientId = getClientId(request)
      const result = await ratelimit.limit(clientId)
      
      // Convert Upstash result to our format
      const resetAt = Date.now() + (windowSeconds * 1000)
      return {
        allowed: result.success,
        remaining: result.remaining,
        resetAt: resetAt,
      }
    }
  }

  // Fallback to in-memory rate limiting (development)
  return checkRateLimitFallback(request, limit, windowSeconds)
}

/**
 * Rate limit middleware for login endpoint
 */
export async function rateLimitLogin(request: Request) {
  return checkRateLimit(
    request,
    RATE_LIMIT_CONFIG.LOGIN.LIMIT,
    RATE_LIMIT_CONFIG.LOGIN.WINDOW
  )
}

/**
 * Rate limit middleware for general API endpoints
 */
export async function rateLimitApi(request: Request) {
  return checkRateLimit(request, RATE_LIMIT_CONFIG.API.LIMIT, RATE_LIMIT_CONFIG.API.WINDOW)
}

/**
 * Rate limit middleware for search endpoint
 */
export async function rateLimitSearch(request: Request) {
  return checkRateLimit(
    request,
    RATE_LIMIT_CONFIG.SEARCH.LIMIT,
    RATE_LIMIT_CONFIG.SEARCH.WINDOW
  )
}

/**
 * Create rate limit response
 */
export function createRateLimitResponse(resetAt: number) {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'X-RateLimit-Reset': String(resetAt),
      },
    }
  )
}
