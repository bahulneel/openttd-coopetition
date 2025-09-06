<template>
  <TemplateScreenCollection
    title="Goals"
    subtitle="Manage individual goals that can be used in scenarios"
    :has-content="goals.length > 0"
    empty-title="No Goals Yet"
    empty-description="Create your first goal to get started with the campaign editor."
  >
    <template #actions>
      <Button class="openttd-button bg-openttd-green text-white" @click="createGoal">
        ➕ New Goal
      </Button>

      <Button variant="outline" class="openttd-button" @click="refreshGoals">
        ↻ Refresh
      </Button>
    </template>

    <template #empty-actions>
      <Button class="openttd-button bg-openttd-green text-white" @click="createGoal">
        ➕ Create Your First Goal
      </Button>
    </template>

    <AggregateGoals 
      :goals="goals"
      @edit="editGoal"
      @duplicate="duplicateGoalHandler"
      @delete="deleteGoal"
    />
  </TemplateScreenCollection>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

const entityStore = useEntityStore()
const toast = useToast()

// Get goals from entity store
const goals = computed(() => entityStore.select('Goal').value)

// Methods
function createGoal() {
  navigateTo('/goals/new')
}

function editGoal(goal: Goal) {
  navigateTo(`/goals/${entityId(goal)}/edit`)
}

async function duplicateGoalHandler(goal: Goal) {
  try {
    const goalId = entityId(goal)
    if (!entityStore.has(goalId)) {
      throw new Error('Goal not found')
    }

    // Use entity store copy method to create a duplicate
    const duplicate = entityStore.copy(goalId, {
      name: `${goal.name} (Copy)`
    })

    toast.add({
      title: '✅ Goal Duplicated',
      description: `Goal "${duplicate.name}" has been duplicated`,
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
  if (confirm(`Are you sure you want to delete the goal "${goal.name}"?`)) {
    try {
      entityStore.retract(entityId(goal))
      toast.add({
        title: '✅ Goal Deleted',
        description: `Goal "${goal.name}" has been deleted`,
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
</script>