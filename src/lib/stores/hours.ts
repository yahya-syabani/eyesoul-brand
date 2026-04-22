import type { Store } from '@/payload-types'

const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

function toMinutes(value: string | null | undefined): number | null {
  if (!value) return null
  const [h, m] = value.split(':')
  const hh = Number(h)
  const mm = Number(m)
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null
  return hh * 60 + mm
}

export function getStoreHoursRowForDate(store: Store, date: Date): NonNullable<Store['hours']>[number] | null {
  if (!store.hours?.length) return null
  const day = dayKeys[date.getDay()]
  return store.hours.find((row) => row.day === day) ?? null
}

export function getStoreHoursLabelForDate(store: Store, date: Date): string {
  const row = getStoreHoursRowForDate(store, date)
  if (!row) return 'Hours unavailable'
  if (!row.open || !row.close) return 'Hours unavailable'
  return `${row.open} - ${row.close}`
}

export function isStoreOpenAtDate(store: Store, date: Date): boolean {
  const row = getStoreHoursRowForDate(store, date)
  if (!row) return false
  const open = toMinutes(row.open)
  const close = toMinutes(row.close)
  if (open == null || close == null) return false

  const nowMinutes = date.getHours() * 60 + date.getMinutes()
  if (close <= open) {
    return nowMinutes >= open || nowMinutes < close
  }
  return nowMinutes >= open && nowMinutes < close
}
