<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          Edit Goal
        </h1>
        <p class="text-muted-foreground">
          Modify the goal configuration
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <Button variant="outline" class="openttd-button" @click="navigateTo('/goals')">
          ← Back to Goals
        </Button>
      </div>
    </div>

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
    <Card v-else-if="form" class="openttd-titlebar">
      <CardContent class="pt-6">
        <form class="space-y-6" @submit.prevent="saveGoal">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">Basic Information</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField v-slot="{ componentField }" name="id">
                <FormItem>
                  <FormLabel>Goal ID</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="e.g., coal_delivery_goal" class="openttd-input" />
                  </FormControl>
                  <FormDescription>
                    Unique identifier for this goal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="type">
                <FormItem>
                  <FormLabel>Goal Type</FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger class="openttd-input">
                        <SelectValue placeholder="Select goal type" />
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
            </div>

            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="e.g., Coal Delivery Challenge" class="openttd-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="meta.description">
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea v-bind="componentField" placeholder="Describe what this goal requires players to do..."
                    class="openttd-input" rows="3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField v-slot="{ componentField }" name="meta.difficulty">
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger class="openttd-input">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="meta.estimated_time">
                <FormItem>
                  <FormLabel>Estimated Time</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="e.g., 30 minutes" class="openttd-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </div>

          <!-- Objective Configuration -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">Objective</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField v-slot="{ componentField }" name="objective.type">
                <FormItem>
                  <FormLabel>Objective Type</FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger class="openttd-input">
                        <SelectValue placeholder="Select objective type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cargo_delivered">Cargo Delivered</SelectItem>
                        <SelectItem value="network_length">Network Length</SelectItem>
                        <SelectItem value="profit">Profit</SelectItem>
                        <SelectItem value="station_built">Stations Built</SelectItem>
                        <SelectItem value="company_value">Company Value</SelectItem>
                        <SelectItem value="town_growth">Town Growth</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Amount field for cargo_delivered, network_length, profit -->
              <FormField v-if="['cargo_delivered', 'network_length', 'profit'].includes(form.objective?.type)"
                v-slot="{ componentField }" name="objective.amount">
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="number" placeholder="e.g., 1000" class="openttd-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Count field for station_built -->
              <FormField v-if="form.objective?.type === 'station_built'" v-slot="{ componentField }"
                name="objective.count">
                <FormItem>
                  <FormLabel>Number of Stations</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="number" placeholder="e.g., 5" class="openttd-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Min value field for company_value -->
              <FormField v-if="form.objective?.type === 'company_value'" v-slot="{ componentField }"
                name="objective.min_value">
                <FormItem>
                  <FormLabel>Minimum Company Value</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="number" placeholder="e.g., 1000000" class="openttd-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Target population field for town_growth -->
              <FormField v-if="form.objective?.type === 'town_growth'" v-slot="{ componentField }"
                name="objective.target_population">
                <FormItem>
                  <FormLabel>Target Population</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="number" placeholder="e.g., 5000" class="openttd-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- Cargo-specific fields -->
            <FormField v-if="form.objective?.type === 'cargo_delivered'" v-slot="{ componentField }"
              name="objective.cargo">
              <FormItem>
                <FormLabel>Cargo Type</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="e.g., COAL" class="openttd-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Town growth-specific fields -->
            <FormField v-if="form.objective?.type === 'town_growth'" v-slot="{ componentField }"
              name="objective.town_id">
              <FormItem>
                <FormLabel>Town ID</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="e.g., TOWN_001" class="openttd-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Network length-specific fields -->
            <FormField v-if="form.objective?.type === 'network_length'" v-slot="{ componentField }"
              name="objective.track_type">
              <FormItem>
                <FormLabel>Track Type</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="e.g., RAIL" class="openttd-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Station built-specific fields -->
            <FormField v-if="form.objective?.type === 'station_built'" v-slot="{ componentField }"
              name="objective.location">
              <FormItem>
                <FormLabel>Location (Optional)</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="e.g., Near coal mine" class="openttd-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Time limit (common to all objectives) -->
            <FormField v-slot="{ componentField }" name="objective.time_limit">
              <FormItem>
                <FormLabel>Time Limit (Optional)</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" placeholder="e.g., 365 (days)" class="openttd-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Constraints -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">Constraints</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="min_players">Minimum Players</Label>
                <Input id="min_players" v-model.number="form.constraints!.players!.min" type="number" min="1" max="8"
                  class="openttd-input" />
              </div>

              <div>
                <Label for="max_players">Maximum Players</Label>
                <Input id="max_players" v-model.number="form.constraints!.players!.max" type="number" min="1" max="8"
                  class="openttd-input" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="min_date">Minimum Date</Label>
                <Input id="min_date" v-model.number="form.constraints!.date!.min" type="number" placeholder="e.g., 1950"
                  class="openttd-input" />
              </div>

              <div>
                <Label for="max_date">Maximum Date</Label>
                <Input id="max_date" v-model.number="form.constraints!.date!.max" type="number" placeholder="e.g., 2050"
                  class="openttd-input" />
              </div>
            </div>
          </div>

          <!-- Rewards -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">Rewards</h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label for="cash_reward">Cash Reward</Label>
                <Input id="cash_reward" v-model.number="form.result!.cash" type="number" placeholder="e.g., 50000"
                  class="openttd-input" />
              </div>

              <div>
                <Label for="score_reward">Score Reward</Label>
                <Input id="score_reward" v-model.number="form.result!.score" type="number" placeholder="e.g., 100"
                  class="openttd-input" />
              </div>

              <div>
                <Label for="reputation_reward">Reputation Reward</Label>
                <Input id="reputation_reward" v-model.number="form.result!.reputation" type="number"
                  placeholder="e.g., 10" class="openttd-input" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="unlock">Unlock</Label>
                <Input id="unlock" v-model="form.result!.unlock" placeholder="e.g., new_vehicle_type"
                  class="openttd-input" />
              </div>

              <div>
                <Label for="achievement">Achievement</Label>
                <Input id="achievement" v-model="form.result!.achievement" placeholder="e.g., coal_master"
                  class="openttd-input" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" class="openttd-button" @click="navigateTo('/goals')">
              Cancel
            </Button>
            <Button type="submit" :disabled="loading" class="openttd-button bg-openttd-green text-white">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
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
const form = useForm({
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
    form.setValues(formData)
  }
})
const saveGoal = form.handleSubmit(async (values) => {
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