<template>
  <div class="text-sm text-muted-foreground">
    <span v-if="rewardSet && hasRewards" class="font-medium">{{ getRewardDescription(rewardSet) }}</span>
    <span v-else>No rewards defined</span>
  </div>
</template>

<script setup lang="ts">
import type { RewardSet } from '~/types'

defineOptions({
  name: 'DomainRewardSetDisplaySummary'
})

interface Props {
  rewardSet?: RewardSet
  asPartial?: boolean
}

const props = defineProps<Props>()

const hasRewards = computed(() => {
  if (!props.rewardSet) return false
  return !!(props.rewardSet.cash || props.rewardSet.score || props.rewardSet.reputation ||
    (props.rewardSet.unlocks && props.rewardSet.unlocks.length > 0))
})

function getRewardDescription(rewardSet: RewardSet): string {
  const parts = []
  if (rewardSet.cash) parts.push(`£${rewardSet.cash.toLocaleString()}`)
  if (rewardSet.score) parts.push(`${rewardSet.score} points`)
  if (rewardSet.reputation) parts.push(`${rewardSet.reputation} reputation`)
  if (rewardSet.unlocks && rewardSet.unlocks.length > 0) parts.push(`Unlock: ${rewardSet.unlocks.join(', ')}`)

  return parts.length > 0 ? parts.join(', ') : 'No rewards'
}
</script>