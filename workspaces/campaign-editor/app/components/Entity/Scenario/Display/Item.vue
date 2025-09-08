<template>
  <div
    class="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
    <div class="flex-1 min-w-0">
      <div class="flex items-center space-x-3">
        <h3 class="font-medium text-foreground truncate">{{ scenario.name }}</h3>
        <Badge v-if="scenario.required" variant="default" class="text-xs">
          Required
        </Badge>
        <Badge v-else variant="secondary" class="text-xs">
          Optional
        </Badge>
        <DomainMetaInfoDisplayCard v-if="scenario.meta" :meta-info="scenario.meta" as-partial />
      </div>
      <p class="text-sm text-muted-foreground mt-1">
        Order: {{ scenario.order }} • {{ scenario.goals?.length || 0 }} goals
      </p>
    </div>

    <div class="flex items-center space-x-2">
      <DomainMetadataDisplayItem :entity="scenario" />
      <Button variant="ghost" size="sm" @click="$emit('edit', scenario)">
        ✏️
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Scenario } from '~/types'

defineOptions({
  name: 'EntityScenarioDisplayItem'
})

interface Props {
  scenario: Scenario
}

defineProps<Props>()

defineEmits<{
  edit: [scenario: Scenario]
}>()
</script>