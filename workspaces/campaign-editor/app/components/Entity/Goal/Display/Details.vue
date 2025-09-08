<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">{{ goal.name }}</h1>
        <p class="text-muted-foreground">ID: {{ entityId(goal) }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <Button variant="outline" class="openttd-button" @click="$emit('edit', goal)">
          ✏️ Edit Goal
        </Button>
      </div>
    </div>

    <!-- Meta Information -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>ℹ️</span>
          <span>Goal Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="font-medium text-foreground">Type:</span>
            <Badge :class="getGoalTypeBadgeClass(goal.type)" class="ml-2">
              {{ goal.type || 'player' }}
            </Badge>
          </div>
        </div>
        <DomainMetaInfoDisplayCard :meta-info="goal.meta" as-partial />
      </CardContent>
    </Card>

    <!-- Objective -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>🎯</span>
          <span>Objective</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DomainObjectiveDefaultDisplaySummary :objective="goal.objective" />
      </CardContent>
    </Card>

    <!-- Constraints -->
    <Card v-if="goal.constraints" class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>⚙️</span>
          <span>Constraints</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DomainConstraintsDisplayCard :constraints="goal.constraints" as-partial />
      </CardContent>
    </Card>

    <!-- Rewards -->
    <Card v-if="goal.result" class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>🏆</span>
          <span>Rewards</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DomainRewardSetDisplaySummary :reward-set="goal.result" />
      </CardContent>
    </Card>

    <!-- Metadata -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>📊</span>
          <span>Metadata</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DomainMetadataDisplayDetails :entity="goal" />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

defineOptions({
  name: 'EntityGoalDisplayDetails'
})

interface Props {
  goal: Goal
}

defineProps<Props>()

defineEmits<{
  edit: [goal: Goal]
}>()

function formatDate(timestamp: number | undefined) {
  if (!timestamp) return 'Unknown'

  const date = new Date(timestamp)
  return date.toLocaleDateString()
}

function getGoalTypeBadgeClass(type: string | undefined) {
  switch (type) {
    case 'player': return 'bg-openttd-blue text-white'
    case 'company': return 'bg-openttd-purple text-white'
    case 'scenario': return 'bg-openttd-orange text-white'
    case 'campaign': return 'bg-openttd-red text-white'
    default: return 'bg-gray-500 text-white'
  }
}

function getDifficultyBadgeClass(difficulty: string | undefined) {
  switch (difficulty) {
    case 'easy': return 'bg-green-500 text-white'
    case 'medium': return 'bg-yellow-500 text-white'
    case 'hard': return 'bg-orange-500 text-white'
    case 'expert': return 'bg-red-500 text-white'
    case 'legendary': return 'bg-purple-500 text-white'
    default: return 'bg-gray-500 text-white'
  }
}
</script>