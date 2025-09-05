import { nanoid } from 'nanoid'

/**
 * Composable for generating unique IDs with a prefix
 * @param prefix - The prefix to use for the ID
 * @returns A unique ID with the prefix
 */
export const useIdentifier = (prefix: string): string => {
  return `${prefix}_${nanoid()}`
}
