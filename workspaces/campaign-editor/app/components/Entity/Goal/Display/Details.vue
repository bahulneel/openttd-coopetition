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
          <div v-if="goal.meta?.difficulty">
            <span class="font-medium text-foreground">Difficulty:</span>
            <Badge :class="getDifficultyBadgeClass(goal.meta.difficulty)" class="ml-2">
              {{ goal.meta.difficulty }}
            </Badge>
          </div>
          <div v-if="goal.meta?.estimated_time">
            <span class="font-medium text-foreground">Estimated Time:</span>
            <span class="text-muted-foreground ml-2">{{ goal.meta.estimated_time }}</span>
          </div>
          <div v-if="goal.meta?.author">
            <span class="font-medium text-foreground">Author:</span>
            <span class="text-muted-foreground ml-2">{{ goal.meta.author }}</span>
          </div>
        </div>

        <div v-if="goal.meta?.description">
          <span class="font-medium text-foreground">Description:</span>
          <p class="text-muted-foreground mt-1">{{ goal.meta.description }}</p>
        </div>

        <div v-if="goal.meta?.tags && goal.meta.tags.length > 0">
          <span class="font-medium text-foreground">Tags:</span>
          <div class="flex flex-wrap gap-2 mt-1">
            <Badge v-for="tag in goal.meta.tags" :key="tag" variant="secondary">
              {{ tag }}
            </Badge>
          </div>
        </div>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="goal.constraints.players">
            <span class="font-medium text-foreground">Players:</span>
            <p class="text-muted-foreground">
              {{ goal.constraints.players.min || 1 }}-{{ goal.constraints.players.max || 8 }}
            </p>
          </div>
          <div v-if="goal.constraints.date">
            <span class="font-medium text-foreground">Date Range:</span>
            <p class="text-muted-foreground">
              {{ goal.constraints.date.min || 1950 }}-{{ goal.constraints.date.max || 2050 }}
            </p>
          </div>
          <div v-if="goal.constraints.map_size">
            <span class="font-medium text-foreground">Map Size:</span>
            <p class="text-muted-foreground">
              {{ goal.constraints.map_size.min || 'Any' }}-{{ goal.constraints.map_size.max || 'Any' }}
            </p>
          </div>
        </div>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-medium text-foreground">Created:</span>
            <span class="text-muted-foreground ml-2">{{ formatDate(goal.__meta?.created) }}</span>
          </div>
          <div>
            <span class="font-medium text-foreground">Last Modified:</span>
            <span class="text-muted-foreground ml-2">{{ formatDate(goal.__meta?.modified) }}</span>
          </div>
        </div>
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