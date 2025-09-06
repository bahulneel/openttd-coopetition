import { nanoid } from 'nanoid'

const NS = 'openttd:coopetition:'

/**
 * Composable for generating unique IDs with a prefix
 * @param prefix - The prefix to use for the ID
 * @returns A unique ID with the prefix
 */
export function useIdentifier(...path: string[]): string {
  const suffix = [...path, nanoid()].join('/')
  const prefix = suffix.startsWith(NS) ? '' : NS
  return `${prefix}${suffix}`
}
