export function selectRange<T>(items: T[], start: number, limit: number): T[] {
  if (!Array.isArray(items)) return []
  if (start < 0 || limit < 0) return []
  return items.slice(start, limit)
}


