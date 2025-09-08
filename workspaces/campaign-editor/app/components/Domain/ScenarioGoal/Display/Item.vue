<template>
  <div
    class="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
    <div class="flex-1 min-w-0">
      <div class="flex items-center space-x-3">
        <h4 class="font-medium text-foreground truncate">
          {{ resolvedGoal?.name || `Goal ${scenarioGoal.order || 0}` }}
        </h4>
        <Badge v-if="scenarioGoal.required" variant="default" class="text-xs">
          Required
        </Badge>
        <Badge v-else variant="secondary" class="text-xs">
          Optional
        </Badge>
        <Badge v-if="resolvedGoal?.type" :class="getGoalTypeBadgeClass(resolvedGoal.type)" class="text-xs">
          {{ resolvedGoal.type }}
        </Badge>
      </div>
      <p class="text-sm text-muted-foreground mt-1">
        {{ resolvedGoal?.meta?.description || `ID: ${scenarioGoal.include.__ref.id}` }}
      </p>
    </div>

    <div class="flex items-center space-x-2">
      <Button variant="ghost" size="sm" @click="$emit('edit', scenarioGoal)">
        ✏️
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScenarioGoal, Goal } from '~/types'

defineOptions({
  name: 'DomainScenarioGoalDisplayItem'
})

interface Props {
  scenarioGoal: ScenarioGoal
}

const props = defineProps<Props>()

defineEmits<{
  edit: [scenarioGoal: ScenarioGoal]
}>()

const resolvedGoal = useResolveEntity<Goal>(props.scenarioGoal.include)

function getGoalTypeBadgeClass(type: string) {
  switch (type) {
    case 'player': return 'bg-openttd-blue text-white'
    case 'company': return 'bg-openttd-purple text-white'
    case 'scenario': return 'bg-openttd-orange text-white'
    case 'campaign': return 'bg-openttd-red text-white'
    default: return 'bg-gray-500 text-white'
  }
}
</script>
