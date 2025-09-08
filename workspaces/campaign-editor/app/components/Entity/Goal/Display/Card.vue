<template>
  <DefineContent>
    <div class="pt-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-2">
            <CardTitle class="text-lg font-semibold">{{ goal.name }}</CardTitle>
            <EntityGoalDisplayBadge :goal="goal" />
          </div>

          <p class="text-muted-foreground mb-3">
            {{ goal.meta?.description || goal.comment || 'No description available' }}
          </p>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="font-medium text-foreground">Objective:</span>
              <DomainObjectiveDefaultDisplaySummary :objective="goal.objective" />
            </div>
            <div v-if="goal.result">
              <span class="font-medium text-foreground">Reward:</span>
              <DomainRewardSetDisplaySummary :reward-set="goal.result" />
            </div>
            <div v-if="goal.constraints">
              <span class="font-medium text-foreground">Constraints:</span>
              <DomainConstraintsDisplayCard :constraints="goal.constraints" as-partial />
            </div>
          </div>
        </div>

        <div v-if="!asPartial" class="flex items-center space-x-2 ml-4">
          <Button variant="outline" size="sm" class="openttd-button" @click="$emit('edit', goal)">
            ✏️ Edit
          </Button>
          <Button variant="outline" size="sm" class="openttd-button" @click="$emit('duplicate', goal)">
            📋 Copy
          </Button>
          <Button
variant="outline" size="sm" class="openttd-button text-red-600 hover:text-red-700"
            @click="$emit('delete', goal)">
            🗑️ Delete
          </Button>
        </div>
      </div>
    </div>
  </DefineContent>

  <!-- Standalone mode (default) -->
  <Card v-if="!asPartial" class="openttd-titlebar">
    <CardContent>
      <Content />
    </CardContent>
  </Card>

  <!-- Partial mode (for composition) -->
  <Content v-else />
</template>

<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import type { Goal } from '~/types'

defineOptions({
  name: 'EntityGoalDisplayCard'
})

interface Props {
  goal: Goal
  asPartial?: boolean
}

defineProps<Props>()

defineEmits<{
  edit: [goal: Goal]
  duplicate: [goal: Goal]
  delete: [goal: Goal]
}>()

const [DefineContent, Content] = createReusableTemplate()
</script>