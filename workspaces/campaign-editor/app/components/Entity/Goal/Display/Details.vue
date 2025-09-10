<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">{{ goal.name }}</h1>
        <p class="text-muted-foreground">ID: {{ entityId(goal) }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="openttd-button"
          @click="$emit('edit', goal)"
        >
          ✏️ Edit Goal
        </Button>
      </div>
    </div>

    <!-- Meta Information -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>ℹ️</span>
          <span>Goal Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="font-medium text-foreground">Type:</span>
            <EntityGoalDisplayBadge
              :goal="goal"
              class="ml-2"
            />
          </div>
        </div>
        <DomainMetaInfoDisplayCard
          :meta-info="goal.meta"
          as-partial
        />
      </CardContent>
    </Card>

    <!-- Objective -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>🎯</span>
          <span>Objective</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DomainObjectiveDefaultDisplaySummary :objective="goal.objective" />
      </CardContent>
    </Card>

    <!-- Constraints -->
    <Card
      v-if="goal.constraints"
      class="openttd-titlebar"
    >
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>⚙️</span>
          <span>Constraints</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DomainConstraintsDisplayCard
          :constraints="goal.constraints"
          as-partial
        />
      </CardContent>
    </Card>

    <!-- Rewards -->
    <Card
      v-if="goal.result"
      class="openttd-titlebar"
    >
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>🏆</span>
          <span>Rewards</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DomainRewardSetDisplaySummary :reward-set="goal.result" />
      </CardContent>
    </Card>

    <!-- Metadata -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>📊</span>
          <span>Metadata</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DomainMetadataDisplayDetails :entity="goal" />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

defineOptions({
  name: 'EntityGoalDisplayDetails',
})

interface Props {
  goal: Goal
}

defineProps<Props>()

defineEmits<{
  edit: [goal: Goal]
}>()
</script>
