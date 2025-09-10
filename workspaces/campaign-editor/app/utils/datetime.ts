import { formatTimeAgo } from '@vueuse/core'

export function toTimeAgo(timestamp: number | undefined) {
  if (!timestamp) return undefined

  return formatTimeAgo(new Date(timestamp))
}
