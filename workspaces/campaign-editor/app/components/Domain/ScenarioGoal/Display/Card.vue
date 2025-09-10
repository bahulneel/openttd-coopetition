<template>
  <DefineContent>
    <div class="space-y-3 p-4">
      <!-- Join-specific header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Badge
            v-if="scenarioGoal.required"
            variant="default"
            class="text-xs"
          >
            Required
          </Badge>
          <Badge
            v-else
            variant="secondary"
            class="text-xs"
          >
            Optional
          </Badge>
          <span class="text-sm text-muted-foreground">Order: {{ scenarioGoal.order || 0 }}</span>
        </div>
        <div
          v-if="scenarioGoal.branch"
          class="text-sm text-muted-foreground"
        >
          Branch: {{ scenarioGoal.branch }}
        </div>
      </div>

      <!-- Entity component -->
      <WithEntity :entity="scenarioGoal.include">
        <template #default="{ value: resolvedGoal }">
          <EntityGoalDisplayCard
            :goal="resolvedGoal"
            :as-partial="asPartial"
          />
        </template>
        <template #fallback>
          <div class="p-3 border border-dashed border-muted-foreground rounded-lg text-center text-muted-foreground">
            Goal not found: {{ referenceId(scenarioGoal.include) }}
          </div>
        </template>
      </WithEntity>

      <!-- Join-specific comment -->
      <p
        v-if="scenarioGoal.comment"
        class="text-sm text-muted-foreground italic"
      >
        {{ scenarioGoal.comment }}
      </p>
    </div>
  </DefineContent>

  <!-- Standalone mode (default) -->
  <Card
    v-if="!asPartial"
    class="scenario-goal-card hover:shadow-lg transition-shadow duration-200"
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
import type { ScenarioGoal } from '~/types'

defineOptions({
  name: 'DomainScenarioGoalDisplayCard',
})

interface Props {
  scenarioGoal: ScenarioGoal
  asPartial?: boolean
}

defineProps<Props>()

const [DefineContent, Content] = createReusableTemplate()
</script>
