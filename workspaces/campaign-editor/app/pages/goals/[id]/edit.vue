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
    <Card v-else class="openttd-titlebar">
      <CardContent class="pt-6">
        <form class="space-y-6" @submit.prevent="saveGoal">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">Basic Information</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="id">Goal ID</Label>
                <Input id="id" v-model="form.id" placeholder="e.g., coal_delivery_goal" class="openttd-input"
                  required />
                <p class="text-sm text-muted-foreground mt-1">
                  Unique identifier for this goal
                </p>
              </div>

              <div>
                <Label for="type">Goal Type</Label>
                <Select v-model="form.type">
                  <SelectTrigger class="openttd-input">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="player">Player Goal</SelectItem>
                    <SelectItem value="company">Company Goal</SelectItem>
                    <SelectItem value="scenario">Scenario Goal</SelectItem>
                    <SelectItem value="campaign">Campaign Goal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label for="title">Title</Label>
              <Input id="title" v-model="form.meta!.title" placeholder="e.g., Coal Delivery Challenge"
                class="openttd-input" />
            </div>

            <div>
              <Label for="description">Description</Label>
              <Textarea id="description" v-model="form.meta!.description"
                placeholder="Describe what this goal requires players to do..." class="openttd-input" rows="3" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="difficulty">Difficulty</Label>
                <Select v-model="form.meta!.difficulty">
                  <SelectTrigger class="openttd-input">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label for="estimated_time">Estimated Time</Label>
                <Input id="estimated_time" v-model="form.meta!.estimated_time" placeholder="e.g., 30 minutes"
                  class="openttd-input" />
              </div>
            </div>
          </div>

          <!-- Objective Configuration -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">Objective</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="objective_type">Objective Type</Label>
                <Select v-model="form.objective.type">
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
              </div>

              <div>
                <Label for="amount">Amount/Value</Label>
                <Input id="amount" v-model.number="form.objective.amount" type="number" placeholder="e.g., 1000"
                  class="openttd-input" />
              </div>
            </div>

            <div v-if="form.objective.type === 'cargo_delivered'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="cargo">Cargo Type</Label>
                <Input id="cargo" v-model="form.objective.cargo" placeholder="e.g., COAL" class="openttd-input" />
              </div>
            </div>

            <div v-if="form.objective.type === 'town_growth'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="target_population">Target Population</Label>
                <Input id="target_population" v-model.number="form.objective.target_population" type="number"
                  placeholder="e.g., 5000" class="openttd-input" />
              </div>
            </div>
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
import type { Goal } from '~/types/campaign'

const route = useRoute()
const { getGoal, saveGoal: saveGoalStore, createEmptyGoal, loading } = useCampaignStore()
const toast = useToast()

const goalId = route.params.id as string
const goal = ref<Goal | undefined>(undefined)
const form = ref<Goal>(createEmptyGoal())

// Load goal data
onMounted(async () => {
  const goalData = getGoal(goalId)
  if (goalData) {
    goal.value = goalData
    form.value = JSON.parse(JSON.stringify(goalData)) // Deep clone
  }
})

async function saveGoal() {
  if (!form.value) return

  try {
    await saveGoalStore(form.value)
    toast.add({
      title: '✅ Goal Updated',
      description: `Goal "${form.value.meta?.title || form.value.id}" has been updated successfully`,
      color: 'green'
    })
    navigateTo('/goals')
  } catch (error) {
    console.error('Failed to update goal:', error)
    toast.add({
      title: '❌ Error',
      description: 'Failed to update goal',
      color: 'red'
    })
  }
}
</script>