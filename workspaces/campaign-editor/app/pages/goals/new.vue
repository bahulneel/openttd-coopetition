<template>
  <TemplateScreenArticle
    title="Create New Goal"
    subtitle="Define a new goal that can be used in scenarios"
  >
    <template #actions>
      <Button
        variant="outline"
        class="openttd-button"
        @click="navigateTo('/goals')"
      >
        ← Back to Goals
      </Button>
    </template>

    <Form @submit="form.handleSubmit(saveGoal)">
      <EntityGoalInputDetails>
        <template #actions>
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              class="openttd-button"
              @click="navigateTo('/goals')"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              :disabled="!meta.valid"
              class="openttd-button bg-openttd-green text-white"
            >
              Create Goal
            </Button>
          </div>
        </template>
      </EntityGoalInputDetails>
    </Form>
  </TemplateScreenArticle>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import type { Goal, GoalValue } from '~/types'
import { createGoal } from '~/utils/model/goals'
import { goalSchema } from '~/utils/schemas'
import { toEntityValue } from '~/utils/entities'

const store = useEntityStore()
const toast = useToast()

// Initialize form with validation
const form = useForm({
  validationSchema: goalSchema,
  initialValues: toEntityValue(createGoal('New Goal')) as GoalValue,
})

const { meta } = form

function saveGoal(values: GoalValue) {
  try {
    // Create goal entity manually
    const goal: Goal = createGoal(values.name, values)
    store.assert(goal)

    toast.add({
      title: '✅ Goal Created',
      description: `Goal "${values.name}" has been created successfully`,
      color: 'green',
    })
    navigateTo('/goals')
  } catch (error) {
    console.error('Failed to save goal:', error)
    toast.add({
      title: '❌ Error',
      description: 'Failed to save goal',
      color: 'red',
    })
  }
}
</script>
