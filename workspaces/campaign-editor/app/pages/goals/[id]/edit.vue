<template>
  <div v-if="loading" class="flex justify-center py-12">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
      <p class="text-muted-foreground">Loading goal...</p>
    </div>
  </div>

  <div v-else-if="error" class="space-y-6">
    <Alert class="border-destructive bg-destructive/10">
      <AlertTitle class="text-destructive">⚠️ Error</AlertTitle>
      <AlertDescription class="text-destructive">
        {{ error }}
        <Button variant="ghost" size="sm" class="ml-2 text-destructive" @click="error = undefined">
          ✕ Dismiss
        </Button>
      </AlertDescription>
    </Alert>

    <div class="flex justify-center">
      <Button variant="outline" class="openttd-button" @click="navigateTo('/goals')">
        ← Back to Goals
      </Button>
    </div>
  </div>

  <div v-else class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center space-x-4">
        <Button variant="ghost" size="sm" class="openttd-button" @click="navigateTo('/goals')">
          ← Back to Goals
        </Button>

        <div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ goal?.name }}
          </h1>
          <p class="text-muted-foreground">
            Edit goal details and configuration
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <Button variant="outline" class="openttd-button" @click="duplicateGoal">
          📄 Duplicate
        </Button>

        <Button variant="outline" class="openttd-button" @click="previewGoal">
          👁️ Preview
        </Button>
      </div>
    </div>

    <!-- Goal Form -->
    <EntityGoalInputDetails v-if="goal" v-model="goal">
      <template #actions>
        <div class="flex items-center justify-between pt-6 border-t border-border">
          <div class="flex items-center space-x-4">
            <div class="text-sm text-muted-foreground">
              {{ hasChanges ? '📝 Unsaved changes' : '✅ All changes saved' }}
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <Button type="button" variant="outline" class="openttd-button" @click="resetGoal">
              ↺ Reset
            </Button>

            <Button type="button" :disabled="saving" class="openttd-button bg-openttd-green text-white"
              @click="saveGoal">
              {{ saving ? '💾 Saving...' : '💾 Save Changes' }}
            </Button>
          </div>
        </div>
      </template>
    </EntityGoalInputDetails>
  </div>
</template>

<script setup lang="ts">
import cloneDeep from 'lodash.clonedeep'
import type { Goal } from '~/types'
import { entityId } from '~/utils/entities'

const route = useRoute()
const router = useRouter()
const entityStore = useEntityStore()

// Simple state
const loading = ref(false)
const error = ref<string | undefined>(undefined)
const saving = ref(false)
const goal = ref<Goal | undefined>(undefined)

// Computed
const goalId = computed(() => route.params.id as string)
const hasChanges = computed(() => {
  if (!goal.value) return false
  const storeGoal = entityStore.get(goalId.value, 'Goal')
  return storeGoal ? JSON.stringify(goal.value) !== JSON.stringify(storeGoal) : false
})

// Load goal on mount
onMounted(async () => {
  await loadGoal()
})

// Methods
async function loadGoal() {
  loading.value = true
  error.value = undefined

  try {
    const goalData = await entityStore.get(goalId.value, 'Goal')
    if (goalData) {
      goal.value = cloneDeep(goalData) // Deep copy
    } else {
      error.value = 'Goal not found'
    }
  } catch {
    error.value = 'Failed to load goal'
  } finally {
    loading.value = false
  }
}

async function saveGoal() {
  if (!goal.value) return

  saving.value = true
  try {
    await entityStore.assert(goal.value)

    const toast = useToast()
    toast.add({
      title: '💾 Goal Saved',
      description: `Goal "${goal.value.name}" has been saved.`,
      color: 'green'
    })
  } catch {
    const toast = useToast()
    toast.add({
      title: '❌ Error',
      description: 'Failed to save goal',
      color: 'red'
    })
  } finally {
    saving.value = false
  }
}

function resetGoal() {
  loadGoal() // Just reload from store
}

function previewGoal() {
  const toast = useToast()
  toast.add({ title: 'Preview functionality coming soon!', color: 'blue' })
}

async function duplicateGoal() {
  if (!goal.value) return

  try {
    const duplicate = entityStore.copy(goalId.value, { name: `${goal.value.name} (Copy)` })
    const toast = useToast()
    toast.add({
      title: '📄 Goal Duplicated',
      description: `Goal "${duplicate.name}" has been created.`,
      color: 'green'
    })
    router.push(`/goals/${entityId(duplicate)}`)
  } catch {
    const toast = useToast()
    toast.add({
      title: '❌ Error',
      description: 'Failed to duplicate goal',
      color: 'red'
    })
  }
}
</script>