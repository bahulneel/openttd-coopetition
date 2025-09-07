<template>
  <TemplateScreenArticle
    title="Create New Goal"
    subtitle="Define a new goal that can be used in scenarios"
  >
    <template #actions>
      <Button variant="outline" class="openttd-button" @click="navigateTo('/goals')">
        ← Back to Goals
      </Button>
    </template>

    <Form @submit="saveGoal">
      <EntityGoalInputDetails>
        <template #actions>
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" class="openttd-button" @click="navigateTo('/goals')">
              Cancel
            </Button>
            <Button type="submit" class="openttd-button bg-openttd-green text-white">
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
import { goalSchema } from '~/utils/schemas'

const { form, save } = useGoalForm()

// Set up form validation with proper initial values
const { handleSubmit } = useForm({
  validationSchema: goalSchema,
  initialValues: {
    id: form.value.__id,
    name: form.value.name,
    type: form.value.type,
    meta: form.value.meta,
    objective: form.value.objective,
    constraints: form.value.constraints,
    result: form.value.result
  }
})

const saveGoal = handleSubmit(async (values) => {
  // Update the form with validated values
  Object.assign(form.value, values)
  
  if (save()) {
    navigateTo('/goals')
  }
})
</script>