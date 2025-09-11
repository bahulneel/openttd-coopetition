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

    <!-- Template Selection -->
    <Card class="openttd-titlebar mb-6">
      <CardHeader>
        <div class="flex items-center space-x-2">
          <span class="text-lg">🧩</span>
          <CardTitle class="text-lg font-semibold">Template Pieces</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <p class="text-sm text-muted-foreground">
            Choose between a basic goal (minimal fields) or complete goal (with all default values). You can always modify these later.
          </p>
          
          <MultiselectPopover
            :items="templatePieces"
            :selected-items="selectedPieces"
            title="Goal Templates"
            description="Choose which template pieces to include"
            placeholder="Select goal templates..."
            @update:selected-items="updateSelectedPieces"
          />
          
          <div v-if="selectedPieces.length > 0" class="text-sm text-muted-foreground">
            <strong>Selected:</strong> {{ selectedPieces.map(key => templatePieces[key].name).join(', ') }}
          </div>
        </div>
      </CardContent>
    </Card>

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
import { useTemplateComposer } from '~/composables/useTemplateComposer'

const store = useEntityStore()
const toast = useToast()

// Template composer
const {
  selectedPieces,
  templatePieces,
  composedTemplate,
  updateSelectedPieces,
} = useTemplateComposer('goal')

// Initialize form with validation
const form = useForm({
  validationSchema: goalSchema,
  initialValues: toEntityValue(createGoal('New Goal', composedTemplate.value)),
})

const { meta } = form

// Watch for template changes and update form
watch(composedTemplate, (newTemplate) => {
  form.setValues(toEntityValue(createGoal('New Goal', newTemplate)))
}, { deep: true })

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
