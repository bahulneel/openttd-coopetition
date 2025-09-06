import objectHash from 'object-hash'
import type { Identified } from '~/types'

const valueKey = Symbol('value')

export function hash<T>(value: T): string {
  if (typeof value === 'object' && value !== null) {
    return objectHash(value)
  }
  return objectHash({[valueKey]: value})
}
