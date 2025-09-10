export function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items))
}

export function isEmpty<T>(value: T[] | undefined | null): boolean
export function isEmpty(value: unknown): boolean
export function isEmpty(value: unknown): boolean {
  if (value == null) return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'string') return value.length === 0
  if (value && typeof value === 'object') return Object.keys(value as object).length === 0
  return false
}
