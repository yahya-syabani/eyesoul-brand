import { describe, expect, it } from 'vitest'
import { safeJsonParse } from './localStorage'

describe('safeJsonParse', () => {
  it('returns ok=false for invalid json', () => {
    const result = safeJsonParse('not-json')
    expect(result.ok).toBe(false)
    expect(result.value).toBeNull()
  })

  it('parses valid json', () => {
    const result = safeJsonParse<{ a: number }>('{"a":1}')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.a).toBe(1)
  })
})


