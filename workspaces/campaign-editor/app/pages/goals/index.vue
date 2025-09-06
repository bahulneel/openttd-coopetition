<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          Goals
        </h1>
        <p class="text-muted-foreground">
          Manage individual goals that can be used in scenarios
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <Button class="openttd-button bg-openttd-green text-white" @click="createGoal">
          ➕ New Goal
        </Button>

        <Button variant="outline" class="openttd-button" @click="refreshGoals">
          ↻ Refresh
        </Button>
      </div>
    </div>

    <!-- Goals List -->
    <div v-if="goals.length > 0" class="space-y-4">
      <Card v-for="goal in goals" :key="entityId(goal)" class="openttd-titlebar">
        <CardContent class="pt-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <CardTitle class="text-lg font-semibold">{{ goal.meta?.title || entityId(goal) }}</CardTitle>
                <Badge :class="getGoalTypeBadgeClass(goal.type)">
                  {{ goal.type || 'player' }}
                </Badge>
                <Badge :class="getDifficultyBadgeClass(goal.meta?.difficulty)">
                  {{ goal.meta?.difficulty || 'medium' }}
                </Badge>
              </div>

              <p class="text-muted-foreground mb-3">
                {{ goal.meta?.description || goal.comment || 'No description available' }}
              </p>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="font-medium text-foreground">Objective:</span>
                  <p class="text-muted-foreground">{{ getObjectiveDescription((goal.objective || {}) as Record<string,
                      unknown>) }}</p>
                </div>
                <div v-if="goal.result">
                  <span class="font-medium text-foreground">Reward:</span>
                  <p class="text-muted-foreground">{{ getRewardDescription(goal.result as Record<string, unknown>) }}
                  </p>
                </div>
                <div v-if="goal.constraints?.players">
                  <span class="font-medium text-foreground">Players:</span>
                  <p class="text-muted-foreground">
                    {{ goal.constraints.players.min || 1 }}-{{ goal.constraints.players.max || 8 }}
                  </p>
                </div>
                <div v-if="goal.constraints?.date">
                  <span class="font-medium text-foreground">Date Range:</span>
                  <p class="text-muted-foreground">
                    {{ goal.constraints.date.min || 1950 }}-{{ goal.constraints.date.max || 2050 }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2 ml-4">
              <Button variant="outline" size="sm" class="openttd-button" @click="editGoal(goal)">
                ✏️ Edit
              </Button>
              <Button variant="outline" size="sm" class="openttd-button" @click="duplicateGoalHandler(goal)">
                📋 Copy
              </Button>
              <Button
variant="outline" size="sm" class="openttd-button text-red-600 hover:text-red-700"
                @click="deleteGoal(goal)">
                🗑️ Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <Card v-else class="openttd-titlebar">
      <CardContent class="pt-12 pb-12">
        <div class="text-center">
          <div class="text-6xl mb-4">🎯</div>
          <CardTitle class="text-lg font-semibold text-foreground mb-2">
            No Goals Yet
          </CardTitle>
          <p class="text-muted-foreground mb-6">
            Create your first goal to get started with the campaign editor.
          </p>
          <Button class="openttd-button bg-openttd-green text-white" @click="createGoal">
            ➕ Create Your First Goal
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types/campaign'

const entityStore = useEntityStore()
const toast = useToast()

// Get goals from entity store
const goals = computed(() => entityStore.select<Goal>('Goal').value)

// Methods
function createGoal() {
  navigateTo('/goals/new')
}

function editGoal(goal: Goal) {
  navigateTo(`/goals/${entityId(goal)}/edit`)
}

async function duplicateGoalHandler(goal: Goal) {
  try {
    const original = entityStore.get<Goal>(entityId(goal), 'Goal')
    if (!original) {
      throw new Error('Goal not found')
    }

    // Use copyEntity utility to create a duplicate
    const duplicate = copyEntity(toStorableValue(original))
    duplicate.name = `${original.name} (Copy)`
    duplicate.meta = {
      ...original.meta,
      title: original.meta?.title ? `${original.meta.title} (Copy)` : undefined
    }

    entityStore.assert(duplicate)

    toast.add({
      title: '✅ Goal Duplicated',
      description: `Goal "${duplicate.meta?.title || entityId(duplicate)}" has been duplicated`,
      color: 'green'
    })
  } catch (error) {
    console.error('Failed to duplicate goal:', error)
    toast.add({
      title: '❌ Error',
      description: 'Failed to duplicate goal',
      color: 'red'
    })
  }
}

async function deleteGoal(goal: Goal) {
  if (confirm(`Are you sure you want to delete the goal "${goal.meta?.title || entityId(goal)}"?`)) {
    try {
      entityStore.retract(entityId(goal))
      toast.add({
        title: '✅ Goal Deleted',
        description: `Goal "${goal.meta?.title || entityId(goal)}" has been deleted`,
        color: 'green'
      })
    } catch (error) {
      console.error('Failed to delete goal:', error)
      toast.add({
        title: '❌ Error',
        description: 'Failed to delete goal',
        color: 'red'
      })
    }
  }
}

async function refreshGoals() {
  // No need to refresh as entity store is reactive
  // This could be used to trigger a reload from file system if needed
}

// Helper functions for display
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

function getObjectiveDescription(objective: Record<string, unknown>) {
  if (!objective) return 'No objective defined'

  const type = objective.type || 'unknown'
  const amount = objective.amount || objective.count || objective.min_value || 0

  switch (type) {
    case 'cargo_delivered':
      return `Deliver ${amount} units of ${objective.cargo || 'cargo'}`
    case 'network_length':
      return `Build ${amount} tiles of network`
    case 'profit':
      return `Reach £${amount.toLocaleString()} profit`
    case 'station_built':
      return `Build ${amount} stations`
    case 'company_value':
      return `Reach £${amount.toLocaleString()} company value`
    case 'town_growth':
      return `Grow town to ${objective.target_population || amount} population`
    default:
      return `${type}: ${amount}`
  }
}

function getRewardDescription(result: Record<string, unknown>) {
  if (!result) return 'No reward defined'

  const parts = []
  if (result.cash) parts.push(`£${result.cash.toLocaleString()}`)
  if (result.score) parts.push(`${result.score} points`)
  if (result.reputation) parts.push(`${result.reputation} reputation`)
  if (result.unlock) parts.push(`Unlock: ${result.unlock}`)
  if (result.achievement) parts.push(`Achievement: ${result.achievement}`)

  return parts.length > 0 ? parts.join(', ') : 'No reward'
}
</script>