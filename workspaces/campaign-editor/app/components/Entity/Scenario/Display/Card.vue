<template>
  <DefineContent>
    <div class="pt-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-2">
            <CardTitle class="text-lg font-semibold">{{ scenario.name }}</CardTitle>
          </div>

          <p class="text-muted-foreground mb-3">
            {{ scenario.comment || 'No description available' }}
          </p>
          <DomainMetaInfoDisplayCard
            :meta-info="scenario.meta"
            as-partial
          />

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div v-if="scenario.goals && scenario.goals.length > 0">
              <span class="font-medium text-foreground">Goals:</span>
              <p class="text-muted-foreground">{{ scenario.goals.length }}</p>
            </div>
          </div>
        </div>

        <div
          v-if="!asPartial"
          class="flex items-center space-x-2 ml-4"
        >
          <Button
            variant="outline"
            size="sm"
            class="openttd-button"
            @click="$emit('edit', scenario)"
          >
            ✏️ Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="openttd-button"
            @click="$emit('duplicate', scenario)"
          >
            📋 Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="openttd-button text-red-600 hover:text-red-700"
            @click="$emit('delete', scenario)"
          >
            🗑️ Delete
          </Button>
        </div>
      </div>
    </div>
  </DefineContent>

  <!-- Standalone mode (default) -->
  <Card
    v-if="!asPartial"
    class="openttd-titlebar"
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
import type { Scenario } from '~/types'

defineOptions({
  name: 'EntityScenarioDisplayCard',
})

interface Props {
  scenario: Scenario
  asPartial?: boolean
}

defineProps<Props>()

defineEmits<{
  edit: [scenario: Scenario]
  duplicate: [scenario: Scenario]
  delete: [scenario: Scenario]
}>()

const [DefineContent, Content] = createReusableTemplate()
</script>
