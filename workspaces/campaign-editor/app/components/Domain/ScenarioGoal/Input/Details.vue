<template>
  <FormField v-slot="{ componentField }" :name="name">
    <MoleculeFormGroup>
      <!-- Goal Selection -->
      <FormField v-slot="{ componentField: includeField }" name="include">
        <FormItem>
          <FormLabel>Goal</FormLabel>
          <FormControl>
            <MoleculeFormInputEntity
v-bind="includeField" :entities="goals" entity-type="goal"
              placeholder="Select a goal..." by="id" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Order -->
      <FormField v-slot="{ componentField: orderField }" name="order">
        <FormItem>
          <FormLabel>Order</FormLabel>
          <FormControl>
            <Input v-bind="orderField" type="number" min="0" class="openttd-input" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Required -->
      <FormField v-slot="{ componentField: requiredField }" name="required">
        <FormItem class="flex flex-row items-center space-x-3 space-y-0">
          <FormControl>
            <Checkbox v-bind="requiredField" />
          </FormControl>
          <div class="space-y-1 leading-none">
            <FormLabel>Required</FormLabel>
            <FormDescription>
              This goal must be completed to progress
            </FormDescription>
          </div>
        </FormItem>
      </FormField>

      <!-- Branch -->
      <FormField v-slot="{ componentField: branchField }" name="branch">
        <FormItem>
          <FormLabel>Branch</FormLabel>
          <FormControl>
            <Input v-bind="branchField" placeholder="e.g., main, alternative" class="openttd-input" />
          </FormControl>
          <FormDescription>
            Optional branch identifier for this goal
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Comment -->
      <FormField v-slot="{ componentField: commentField }" name="comment">
        <FormItem>
          <FormLabel>Comment</FormLabel>
          <FormControl>
            <Textarea v-bind="commentField" placeholder="Additional notes..." class="openttd-input" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </MoleculeFormGroup>
  </FormField>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

defineOptions({
  name: 'DomainScenarioGoalInputDetails'
})

interface Props {
  name: string
  goals: Goal[]
}

defineProps<Props>()
</script>
