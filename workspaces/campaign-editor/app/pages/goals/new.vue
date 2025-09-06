<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          Create New Goal
        </h1>
        <p class="text-muted-foreground">
          Define a new goal that can be used in scenarios
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <Button variant="outline" class="openttd-button" @click="navigateTo('/goals')">
          ← Back to Goals
        </Button>
      </div>
    </div>

    <!-- Goal Form -->
    <Card class="openttd-titlebar">
      <CardContent class="pt-6">
        <form class="space-y-6" @submit.prevent="saveGoal">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">Basic Information</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="id">Goal ID</Label>
                <Input id="id" v-model="form.__id" placeholder="e.g., coal_delivery_goal" class="openttd-input"
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
              <Label for="name">Title</Label>
              <Input id="name" v-model="form.name" placeholder="e.g., Coal Delivery Challenge" class="openttd-input" />
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
                <Select v-model="form.objective!.type">
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

              <!-- Amount field for cargo_delivered, network_length, profit -->
              <div v-if="['cargo_delivered', 'network_length', 'profit'].includes(form.objective?.type || '')">
                <Label for="amount">Amount</Label>
                <Input id="amount" v-model.number="(form.objective as any)?.amount" type="number"
                  placeholder="e.g., 1000" class="openttd-input" />
              </div>

              <!-- Count field for station_built -->
              <div v-if="form.objective?.type === 'station_built'">
                <Label for="count">Number of Stations</Label>
                <Input id="count" v-model.number="(form.objective as any)?.count" type="number" placeholder="e.g., 5"
                  class="openttd-input" />
              </div>

              <!-- Min value field for company_value -->
              <div v-if="form.objective?.type === 'company_value'">
                <Label for="min_value">Minimum Company Value</Label>
                <Input id="min_value" v-model.number="(form.objective as any)?.min_value" type="number"
                  placeholder="e.g., 1000000" class="openttd-input" />
              </div>

              <!-- Target population field for town_growth -->
              <div v-if="form.objective?.type === 'town_growth'">
                <Label for="target_population">Target Population</Label>
                <Input id="target_population" v-model.number="(form.objective as any)?.target_population" type="number"
                  placeholder="e.g., 5000" class="openttd-input" />
              </div>
            </div>

            <!-- Cargo-specific fields -->
            <div v-if="form.objective?.type === 'cargo_delivered'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="cargo">Cargo Type</Label>
                <Input id="cargo" v-model="(form.objective as any)?.cargo" placeholder="e.g., COAL"
                  class="openttd-input" />
              </div>
            </div>

            <!-- Town growth-specific fields -->
            <div v-if="form.objective?.type === 'town_growth'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="town_id">Town ID</Label>
                <Input id="town_id" v-model="(form.objective as any)?.town_id" placeholder="e.g., TOWN_001"
                  class="openttd-input" />
              </div>
            </div>

            <!-- Network length-specific fields -->
            <div v-if="form.objective?.type === 'network_length'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="track_type">Track Type</Label>
                <Input id="track_type" v-model="(form.objective as any)?.track_type" placeholder="e.g., RAIL"
                  class="openttd-input" />
              </div>
            </div>

            <!-- Station built-specific fields -->
            <div v-if="form.objective?.type === 'station_built'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="location">Location (Optional)</Label>
                <Input id="location" v-model="(form.objective as any)?.location" placeholder="e.g., Near coal mine"
                  class="openttd-input" />
              </div>
            </div>

            <!-- Time limit (common to all objectives) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="time_limit">Time Limit (Optional)</Label>
                <Input id="time_limit" v-model.number="(form.objective as any)?.time_limit" type="number"
                  placeholder="e.g., 365 (days)" class="openttd-input" />
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
                <Label for="unlocks">Unlocks</Label>
                <Input id="unlocks" v-model="form.result!.unlocks" placeholder="e.g., new_vehicle_type"
                  class="openttd-input" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" class="openttd-button" @click="navigateTo('/goals')">
              Cancel
            </Button>
            <Button type="submit" class="openttd-button bg-openttd-green text-white">
              Create Goal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { form, save } = useGoalForm()

function saveGoal() {
  save()
  navigateTo('/goals')
}
</script>