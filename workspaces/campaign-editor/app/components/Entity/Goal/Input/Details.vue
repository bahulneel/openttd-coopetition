<template>
  <form class="space-y-6" @submit.prevent="$emit('submit')">
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

      <DomainMetaInfoInputDetails />
    </div>

    <!-- Objective Configuration -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Objective</h3>

      <DomainObjectiveDefaultInputDetails />

      <!-- Type-specific objective fields -->
      <MoleculeFormConditional :condition="objectiveType === 'cargo_delivered'">
        <DomainObjectiveCargoDeliveredInputDetails />
      </MoleculeFormConditional>

      <MoleculeFormConditional :condition="objectiveType === 'network_length'">
        <DomainObjectiveNetworkLengthInputDetails />
      </MoleculeFormConditional>

      <MoleculeFormConditional :condition="objectiveType === 'profit'">
        <DomainObjectiveProfitInputDetails />
      </MoleculeFormConditional>

      <MoleculeFormConditional :condition="objectiveType === 'station_built'">
        <DomainObjectiveStationBuiltInputDetails />
      </MoleculeFormConditional>

      <MoleculeFormConditional :condition="objectiveType === 'company_value'">
        <DomainObjectiveCompanyValueInputDetails />
      </MoleculeFormConditional>

      <MoleculeFormConditional :condition="objectiveType === 'town_growth'">
        <DomainObjectiveTownGrowthInputDetails />
      </MoleculeFormConditional>
    </div>

    <!-- Constraints -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Constraints</h3>
      <DomainConstraintsInputDetails />
    </div>

    <!-- Rewards -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Rewards</h3>

      <MoleculeFormGroup>
        <FormField v-slot="{ componentField }" name="result.cash">
          <FormItem>
            <FormLabel>Cash Reward</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="number" placeholder="e.g., 50000" class="openttd-input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="result.score">
          <FormItem>
            <FormLabel>Score Reward</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="number" placeholder="e.g., 100" class="openttd-input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="result.reputation">
          <FormItem>
            <FormLabel>Reputation Reward</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="number" placeholder="e.g., 10" class="openttd-input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="result.unlock">
          <FormItem>
            <FormLabel>Unlock</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="e.g., new_vehicle_type" class="openttd-input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </MoleculeFormGroup>
    </div>

    <slot name="actions" />
  </form>
</template>

<script setup lang="ts">
import { useFormValues } from 'vee-validate'

defineOptions({
  name: 'EntityGoalInputDetails'
})

defineEmits<{
  submit: []
}>()

// Get the current objective type from form values
const formValues = useFormValues<{ objective?: { type?: string } }>()
const objectiveType = computed(() => formValues.value?.objective?.type)
</script>