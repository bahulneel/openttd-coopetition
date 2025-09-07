<template>
  <TemplateScreenArticle
    title="Edit Goal"
    subtitle="Modify the goal configuration"
  >
    <template #actions>
      <Button variant="outline" class="openttd-button" @click="navigateTo('/goals')">
        ← Back to Goals
      </Button>
    </template>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <div class="text-4xl mb-4">🔄</div>
        <p class="text-muted-foreground">Loading goal...</p>
      </div>
    </div>

    <!-- Goal Not Found -->
    <Card v-else-if="!goal" class="openttd-titlebar">
      <CardContent class="pt-12 pb-12">
        <div class="text-center">
          <div class="text-6xl mb-4">❌</div>
          <CardTitle class="text-lg font-semibold text-foreground mb-2">
            Goal Not Found
          </CardTitle>
          <p class="text-muted-foreground mb-6">
            The goal you're looking for doesn't exist or has been deleted.
          </p>
          <Button class="openttd-button bg-openttd-green text-white" @click="navigateTo('/goals')">
            ← Back to Goals
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Goal Form -->
    <Form v-else-if="form" @submit="saveGoal">
      <EntityGoalInputDetails>
        <template #actions>
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" class="openttd-button" @click="navigateTo('/goals')">
              Cancel
            </Button>
            <Button type="submit" :disabled="loading" class="openttd-button bg-openttd-green text-white">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </Button>
          </div>
        </template>
      </EntityGoalInputDetails>
    </Form>
  </TemplateScreenArticle>
</template>

<script setup lang="ts">
import type { Goal, GoalFormData } from '~/types'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { goalSchema } from '~/utils/schemas'

const route = useRoute()
const entityStore = useEntityStore()
const toast = useToast()

const goalId = route.params.id as string
const goal = ref<Goal | undefined>(undefined)
const { isLoading: loading, start, finish } = useLoadingIndicator()

// Form setup with VeeValidate
const { handleSubmit, setValues } = useForm({
  validationSchema: goalSchema,
  initialValues: {
    id: '',
    name: '',
    type: 'player',
    meta: {
      description: '',
      difficulty: 'medium',
      estimated_time: ''
    },
    objective: {
      type: 'cargo_delivered',
      amount: 0
    },
    constraints: {
      players: { min: 1, max: 8 },
      date: { min: 1950, max: 2050 }
    },
    result: {
      cash: 0,
      score: 0,
      reputation: 0,
      unlocks: []
    }
  }
})

// Load goal data
onMounted(async () => {
  const goalData = entityStore.get(goalId, 'Goal')
  if (goalData) {
    const entity = toStorableValue(goalData)
    goal.value = entity
    const formData = goalToFormData(entity) // Convert to FormData for form handling
    setValues(formData)
  }
})

const saveGoal = handleSubmit(async (values) => {
  start()
  try {
    // Convert FormData back to Entity
    const entity = asGoal(values)

    // Update the entity in the store
    entityStore.assert(entity)

    // Save to backend
    await $fetch('/api/goals', {
      method: 'POST',
      body: { goal: entity }
    })

    toast.add({
      title: '✅ Goal Updated',
      description: `Goal "${values.name}" has been updated successfully`,
      color: 'green'
    })
    finish()
    navigateTo('/goals')
  } catch (error) {
    console.error('Failed to update goal:', error)
    finish({ error: true })
    toast.add({
      title: '❌ Error',
      description: 'Failed to update goal',
      color: 'red'
    })
  }
})
</script>