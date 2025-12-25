import { useEffect, useRef, useState } from 'react'
import { useCountdown } from './useCountdown'
import CountdownTimeType from '@/type/CountdownType'

const CART_EXPIRY_KEY = 'eyesoul_cart_expires_at'
const CART_EXPIRES_IN_MS = 15 * 60 * 1000

// Use a deterministic default value to prevent hydration mismatch
const DEFAULT_EXPIRY_OFFSET = CART_EXPIRES_IN_MS
const getDefaultExpiry = (): number => {
  // Use a fixed timestamp to ensure server and client match on initial render
  // This will be updated after mount with the actual value
  return 0
}

const getOrInitCartExpiryAt = (): number => {
  const fallback = Date.now() + CART_EXPIRES_IN_MS
  if (typeof window === 'undefined') return fallback

  const raw = window.localStorage.getItem(CART_EXPIRY_KEY)
  const parsed = raw ? Number(raw) : NaN
  const now = Date.now()
  if (!Number.isFinite(parsed) || parsed <= now) {
    window.localStorage.setItem(CART_EXPIRY_KEY, String(fallback))
    return fallback
  }
  return parsed
}

export function useCartExpiry() {
  const expiryAtRef = useRef<number | null>(null)
  // Use default value initially to prevent hydration mismatch
  const [expiryAt, setExpiryAt] = useState<number>(getDefaultExpiry)

  useEffect(() => {
    const actualExpiry = getOrInitCartExpiryAt()
    expiryAtRef.current = actualExpiry
    setExpiryAt(actualExpiry)
  }, [])

  // Use a deterministic initial target time to prevent hydration mismatch
  // Use a far future date that will always give the same result on server and client
  const INITIAL_TARGET_TIME = new Date('2099-12-31T23:59:59Z').getTime()
  const timeLeft = useCountdown({
    targetTime: expiryAt > 0 ? expiryAt : INITIAL_TARGET_TIME,
    interval: 1000,
  })

  const resetExpiry = () => {
    const newExpiry = Date.now() + CART_EXPIRES_IN_MS
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CART_EXPIRY_KEY, String(newExpiry))
    }
    setExpiryAt(newExpiry)
    expiryAtRef.current = newExpiry
  }

  return { timeLeft, resetExpiry }
}

