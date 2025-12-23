import { describe, expect, it } from 'vitest'
import { sanitizeForMetadata } from './sanitize'

describe('sanitizeForMetadata', () => {
  it('removes control chars and angle brackets, trims, and limits length', () => {
    const raw = '\u0000  <Hello> world \n'
    expect(sanitizeForMetadata(raw, 100)).toBe('Hello world')
  })

  it('limits max length', () => {
    expect(sanitizeForMetadata('a'.repeat(200), 10)).toHaveLength(10)
  })
})


