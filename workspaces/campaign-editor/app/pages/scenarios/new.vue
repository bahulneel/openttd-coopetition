<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          Create New Scenario
        </h1>
        <p class="text-muted-foreground">
          Define a new scenario that combines goals into a cohesive experience
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <Button variant="outline" class="openttd-button" @click="navigateTo('/scenarios')">
          ← Back to Scenarios
        </Button>
      </div>
    </div>

    <!-- Scenario Form -->
    <Card class="openttd-titlebar">
      <CardContent class="pt-6">
        <form class="space-y-6" @submit.prevent="saveScenario">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">Basic Information</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="id">Scenario ID</Label>
                <Input
id="id" v-model="form.__id" placeholder="e.g., industrial_hub_scenario" class="openttd-input"
                  required />
                <p class="text-sm text-muted-foreground mt-1">
                  Unique identifier for this scenario
                </p>
              </div>
            </div>

            <div>
              <Label for="name">Name</Label>
              <Input id="name" v-model="form.name" placeholder="e.g., Industrial Hub Challenge" class="openttd-input" />
            </div>

            <div>
              <Label for="description">Description</Label>
              <Textarea
id="description" v-model="form.meta!.description"
                placeholder="Describe what this scenario requires players to do..." class="openttd-input" rows="3" />
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
                <Input
id="estimated_time" v-model="form.meta!.estimated_time" placeholder="e.g., 2 hours"
                  class="openttd-input" />
              </div>
            </div>
          </div>

          <!-- Goals Selection -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">Goals</h3>

            <div v-if="availableGoals.length === 0" class="text-center py-8 text-muted-foreground">
              <p>No goals available. <NuxtLink to="/goals" class="text-openttd-blue hover:underline">Create some goals
                  first</NuxtLink>.</p>
            </div>

            <div v-else class="space-y-3">
              <div
v-for="goal in availableGoals" :key="goal.__id"
                class="flex items-center space-x-3 p-3 border rounded-lg">
                <input
:id="`goal-${goal.__id}`" v-model="selectedGoals" :value="goal.__id" type="checkbox"
                  class="openttd-checkbox">
                <label :for="`goal-${goal.__id}`" class="flex-1 cursor-pointer">
                  <div class="font-medium">{{ goal.name }}</div>
                  <div class="text-sm text-muted-foreground">{{ goal.meta?.description || goal.comment }}</div>
                </label>
                <Badge :class="getGoalTypeBadgeClass(goal.type)">
                  {{ goal.type || 'player' }}
                </Badge>
              </div>
            </div>
          </div>

          <!-- Constraints -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">Constraints</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="min_players">Minimum Players</Label>
                <Input
id="min_players" v-model.number="form.constraints!.players!.min" type="number" min="1" max="8"
                  class="openttd-input" />
              </div>

              <div>
                <Label for="max_players">Maximum Players</Label>
                <Input
id="max_players" v-model.number="form.constraints!.players!.max" type="number" min="1" max="8"
                  class="openttd-input" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="min_date">Minimum Date</Label>
                <Input
id="min_date" v-model.number="form.constraints!.date!.min" type="number" placeholder="e.g., 1950"
                  class="openttd-input" />
              </div>

              <div>
                <Label for="max_date">Maximum Date</Label>
                <Input
id="max_date" v-model.number="form.constraints!.date!.max" type="number" placeholder="e.g., 2050"
                  class="openttd-input" />
              </div>
            </div>
          </div>

          <!-- Game Settings -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">Game Settings</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="economy">Economy</Label>
                <Select v-model="form.settings!.economy">
                  <SelectTrigger class="openttd-input">
                    <SelectValue placeholder="Select economy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="flex items-center space-x-2">
                <input id="disasters" v-model="form.settings!.disasters" type="checkbox" class="openttd-checkbox">
                <label for="disasters" class="text-sm">Disasters</label>
              </div>

              <div class="flex items-center space-x-2">
                <input id="breakdowns" v-model="form.settings!.breakdowns" type="checkbox" class="openttd-checkbox">
                <label for="breakdowns" class="text-sm">Breakdowns</label>
              </div>

              <div class="flex items-center space-x-2">
                <input id="inflation" v-model="form.settings!.inflation" type="checkbox" class="openttd-checkbox">
                <label for="inflation" class="text-sm">Inflation</label>
              </div>

              <div class="flex items-center space-x-2">
                <input id="seasons" v-model="form.settings!.seasons" type="checkbox" class="openttd-checkbox">
                <label for="seasons" class="text-sm">Seasons</label>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" class="openttd-button" @click="navigateTo('/scenarios')">
              Cancel
            </Button>
            <Button type="submit" class="openttd-button bg-openttd-purple text-white">
              Create Scenario
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { form, selectedGoals, availableGoals, getGoalTypeBadgeClass, save } = useScenarioForm()

function saveScenario() {
  save()
  navigateTo('/scenarios')
}
</script>