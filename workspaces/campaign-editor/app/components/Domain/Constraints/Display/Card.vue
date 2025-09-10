<template>
  <DefineContent>
    <div class="space-y-3 p-4">
      <!-- Players -->
      <div
        v-if="constraints.players"
        class="text-sm"
      >
        <span class="font-medium text-foreground">Players:</span>
        <span class="text-muted-foreground ml-2">
          {{ constraints.players.min || 1 }}-{{ constraints.players.max || 8 }}
        </span>
      </div>

      <!-- Date Range -->
      <div
        v-if="constraints.date"
        class="text-sm"
      >
        <span class="font-medium text-foreground">Date Range:</span>
        <span class="text-muted-foreground ml-2">
          {{ constraints.date.min || 1950 }}-{{ constraints.date.max || 2050 }}
        </span>
      </div>

      <!-- Map Size -->
      <div
        v-if="constraints.map_size"
        class="text-sm"
      >
        <span class="font-medium text-foreground">Map Size:</span>
        <span class="text-muted-foreground ml-2">
          {{ constraints.map_size.min || 64 }}x{{ constraints.map_size.max || 2048 }}
        </span>
      </div>

      <!-- Difficulty Range -->
      <div
        v-if="constraints.difficulty"
        class="text-sm"
      >
        <span class="font-medium text-foreground">Difficulty:</span>
        <span class="text-muted-foreground ml-2">
          {{ constraints.difficulty.min || 'Easy' }}-{{ constraints.difficulty.max || 'Legendary' }}
        </span>
      </div>

      <!-- Conditional Constraints -->
      <div
        v-if="constraints.conditional && constraints.conditional.length > 0"
        class="text-sm"
      >
        <span class="font-medium text-foreground">Conditional:</span>
        <div class="ml-4 space-y-1">
          <div
            v-for="(cond, index) in constraints.conditional"
            :key="index"
            class="text-muted-foreground"
          >
            {{ cond.condition.type }}: {{ cond.condition.value }}
          </div>
        </div>
      </div>

      <!-- Comment -->
      <div
        v-if="constraints.comment"
        class="text-sm"
      >
        <span class="font-medium text-foreground">Note:</span>
        <p class="text-muted-foreground mt-1">{{ constraints.comment }}</p>
      </div>
    </div>
  </DefineContent>

  <!-- Standalone mode (default) -->
  <Card
    v-if="!asPartial"
    class="constraints-card hover:shadow-lg transition-shadow duration-200"
  >
    <CardContent>
      <Content />
    </CardContent>
  </Card>

  <!-- Partial mode (for composition) -->
  <Content v-else />
</template>

<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import type { Constraints } from '~/types'

defineOptions({
  name: 'DomainConstraintsDisplayCard',
})

interface Props {
  constraints: Constraints
  asPartial?: boolean
}

defineProps<Props>()

const [DefineContent, Content] = createReusableTemplate()
</script>
