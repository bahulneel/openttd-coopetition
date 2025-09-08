<template>
  <TemplateScreenArticle title="Create New Goal" subtitle="Define a new goal that can be used in scenarios">
    <template #actions>
      <Button variant="outline" class="openttd-button" @click="navigateTo('/goals')">
        ← Back to Goals
      </Button>
    </template>

    <Form @submit="saveGoal" :validation-schema="goalSchema">
      <EntityGoalInputDetails v-model="form">
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
import type { Goal } from '~/types'
import { createGoal, goalTemplate } from '~/utils/model/goals'
import { goalSchema } from '~/utils/schemas'

const store = useEntityStore()
const toast = useToast()

// Initialize form with empty goal
const form = ref<Goal>(createGoal('New Goal', goalTemplate.newItem))

function saveGoal() {
  store.assert(form.value)
  toast.add({
    title: '✅ Goal Created',
    description: `Goal "${form.value.name || form.value.__id}" has been created successfully`,
    color: 'green',
  })
  navigateTo('/goals')
}
</script>