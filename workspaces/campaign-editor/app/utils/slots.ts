import type { Slots } from 'vue'

export function slotNames(slots: Slots): string[] {
  return Object.keys(slots)
}
