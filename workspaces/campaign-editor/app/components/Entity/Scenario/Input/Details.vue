<template>
  <div class="space-y-6">
    <!-- Basic Information -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <div class="flex items-center space-x-2">
          <span class="text-lg">ℹ️</span>
          <CardTitle class="text-lg font-semibold">Basic Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <MoleculeFormGroup>
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>Scenario ID *</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="scenario_unique_id" />
              </FormControl>
              <FormDescription>Unique identifier for this scenario</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Scenario Name" />
              </FormControl>
              <FormDescription>Display name for the scenario</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="include">
            <FormItem>
              <FormLabel>Include File *</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="scenario_file.nut" />
              </FormControl>
              <FormDescription>Scenario file to include</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="order">
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="number" placeholder="1" />
              </FormControl>
              <FormDescription>Display order in campaign</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="meta.difficulty">
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="openttd-button">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="easy">🟢 Easy</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="hard">🟠 Hard</SelectItem>
                  <SelectItem value="expert">🔴 Expert</SelectItem>
                  <SelectItem value="legendary">🟣 Legendary</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Difficulty level for this scenario</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="meta.estimated_time">
            <FormItem>
              <FormLabel>Estimated Time</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="e.g., 1-2 hours" />
              </FormControl>
              <FormDescription>Expected time to complete</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </MoleculeFormGroup>

        <div class="mt-6">
          <FormField v-slot="{ componentField }" name="meta.description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Describe your scenario..." class="min-h-24" />
              </FormControl>
              <FormDescription>Detailed description of the scenario</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </CardContent>
    </Card>

    <!-- Tags -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <div class="flex items-center space-x-2">
          <span class="text-lg">🏷️</span>
          <CardTitle class="text-lg font-semibold">Tags</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <MoleculeFormInputTags name="meta.tags" label="Tags" placeholder="Add tags..."
          description="Add relevant tags for categorization" />
      </CardContent>
    </Card>

    <!-- Goals -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-lg">🎯</span>
            <CardTitle class="text-lg font-semibold">Goals</CardTitle>
          </div>
          <Button type="button" variant="outline" class="openttd-button" @click="addGoal">
            ➕ Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="formData.goals && formData.goals.length > 0" class="space-y-4">
          <div v-for="(goal, index) in formData.goals" :key="index" class="p-4 border border-border rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium">Goal {{ index + 1 }}</h4>
              <Button type="button" variant="ghost" size="sm" class="text-destructive hover:text-destructive-foreground"
                @click="removeGoal(index)">
                🗑️ Remove
              </Button>
            </div>

            <MoleculeFormGroup>
              <FormField v-slot="{ componentField }" :name="`goals.${index}.name`">
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Goal Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" :name="`goals.${index}.type`">
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger class="openttd-button">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="player">Player Goal</SelectItem>
                      <SelectItem value="company">Company Goal</SelectItem>
                      <SelectItem value="scenario">Scenario Goal</SelectItem>
                      <SelectItem value="campaign">Campaign Goal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>
            </MoleculeFormGroup>
          </div>
        </div>

        <div v-else class="text-center py-8 text-muted-foreground">
          <p>No goals added yet. Click "Add Goal" to get started.</p>
        </div>
      </CardContent>
    </Card>

    <!-- Actions Slot -->
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
// import type { Scenario } from '~/types' // TODO: Use when implementing scenario functionality

defineOptions({
  name: 'EntityScenarioInputDetails'
})

const formData = defineModel<ScenarioFormData>({ required: true })

// Form methods

function addGoal() {
  const currentGoals = formData.value.goals || []
  const newGoal = {
    name: '',
    type: 'player'
  }
  formData.value = {
    ...formData.value,
    goals: [...currentGoals, newGoal]
  }
}

function removeGoal(index: number) {
  const currentGoals = formData.value.goals || []
  const newGoals = currentGoals.filter((_: unknown, i: number) => i !== index)
  formData.value = {
    ...formData.value,
    goals: newGoals
  }
}
</script>