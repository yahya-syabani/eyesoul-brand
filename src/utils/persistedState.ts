import { safeJsonParse, safeJsonStringify, safeStorageGet, safeStorageSet } from './localStorage'

type SanitizeFn<T> = (value: unknown) => T[]

export function readPersistedArray<T>(storageKey: string, sanitize: SanitizeFn<T>): T[] {
  const raw = safeStorageGet(storageKey)
  if (!raw.ok) return []
  const parsed = safeJsonParse<unknown>(raw.value)
  if (!parsed.ok) return []
  return sanitize(parsed.value)
}

export function writePersistedArray<T>(storageKey: string, value: T[]): void {
  const json = safeJsonStringify(value)
  if (!json.ok) return
  const res = safeStorageSet(storageKey, json.value)
  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.warn(`Failed to persist ${storageKey} to localStorage`, res.error)
  }
}


