<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { Action } from '@/types'

type Tone = 'brown' | 'green' | 'purple' | 'blue'

interface DashboardCardProps {
  label: string
  value: string | number
  tone: Tone
  class?: HTMLAttributes['class']
  action?: Action
}

defineOptions({ name: 'MoleculeDashboardCard' })

const props = withDefaults(defineProps<DashboardCardProps>(), {})

const toneToRoot = {
  brown: 'bg-openttd-brown/20 border-openttd-brown/40',
  green: 'bg-openttd-green/20 border-openttd-green/40',
  purple: 'bg-openttd-purple/20 border-openttd-purple/40',
  blue: 'bg-openttd-blue/20 border-openttd-blue/40'
} as const

const toneToLabel = {
  brown: 'text-openttd-brown',
  green: 'text-openttd-green',
  purple: 'text-openttd-purple',
  blue: 'text-openttd-blue'
} as const

const toneToIconBg = {
  brown: 'bg-openttd-brown',
  green: 'bg-openttd-green',
  purple: 'bg-openttd-purple',
  blue: 'bg-openttd-blue'
} as const

const rootClass = computed(() => cn('campaign-card', toneToRoot[props.tone], props.class))
const labelClass = computed(() => cn('text-sm font-medium', toneToLabel[props.tone]))
const iconBoxClass = computed(() => cn('h-12 w-12 rounded border-2 border-border flex items-center justify-center openttd-button', toneToIconBg[props.tone]))

function defaultEmoji(tone: Tone): string {
  switch (tone) {
    case 'brown': return '📂'
    case 'green': return '🎯'
    case 'purple': return '🗺️'
    case 'blue': return '⚡'
  }
}
</script>

<template>
  <Card :class="rootClass">
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <div>
          <p :class="labelClass">{{ label }}</p>
          <p class="text-2xl font-bold text-foreground">{{ value }}</p>
        </div>
        <template v-if="action">
          <MoleculeAction :action="action" />
        </template>
        <div v-else :class="iconBoxClass">
          <slot name="icon">
            <span class="text-lg">{{ defaultEmoji(tone) }}</span>
          </slot>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
