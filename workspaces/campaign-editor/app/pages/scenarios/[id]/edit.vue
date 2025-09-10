<template>
  <div v-if="loading" class="flex justify-center py-12">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
      <p class="text-muted-foreground">Loading scenario...</p>
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
      <Button variant="outline" class="openttd-button" @click="navigateTo('/scenarios')">
        ← Back to Scenarios
      </Button>
    </div>
  </div>

  <div v-else class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center space-x-4">
        <Button variant="ghost" size="sm" class="openttd-button" @click="navigateTo('/scenarios')">
          ← Back to Scenarios
        </Button>

        <div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ scenario?.name }}
          </h1>
          <p class="text-muted-foreground">
            Edit scenario details and configuration
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <Button variant="outline" class="openttd-button" @click="duplicateScenario">
          📄 Duplicate
        </Button>

        <Button variant="outline" class="openttd-button" @click="previewScenario">
          👁️ Preview
        </Button>
      </div>
    </div>

    <!-- Scenario Form -->
    <EntityScenarioInputDetails v-if="scenario" v-model="scenario">
      <template #actions>
        <div class="flex items-center justify-between pt-6 border-t border-border">
          <div class="flex items-center space-x-4">
            <div class="text-sm text-muted-foreground">
              {{ hasChanges ? '📝 Unsaved changes' : '✅ All changes saved' }}
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <Button type="button" variant="outline" class="openttd-button" @click="resetScenario">
              ↺ Reset
            </Button>

            <Button type="button" :disabled="saving" class="openttd-button bg-openttd-purple text-white"
              @click="saveScenario">
              {{ saving ? '💾 Saving...' : '💾 Save Changes' }}
            </Button>
          </div>
        </div>
      </template>
    </EntityScenarioInputDetails>
  </div>
</template>

<script setup lang="ts">
import cloneDeep from 'lodash.clonedeep'
import type { Scenario } from '~/types'
import { entityId } from '~/utils/entities'

const route = useRoute()
const router = useRouter()
const entityStore = useEntityStore()

// Simple state
const loading = ref(false)
const error = ref<string | undefined>(undefined)
const saving = ref(false)
const scenario = ref<Scenario | undefined>(undefined)

// Computed
const scenarioId = computed(() => route.params.id as string)
const hasChanges = computed(() => {
  if (!scenario.value) return false
  const storeScenario = entityStore.get(scenarioId.value, 'Scenario')
  return storeScenario ? JSON.stringify(scenario.value) !== JSON.stringify(storeScenario) : false
})

// Load scenario on mount
onMounted(async () => {
  await loadScenario()
})

// Methods
async function loadScenario() {
  loading.value = true
  error.value = undefined

  try {
    const scenarioData = await entityStore.get(scenarioId.value, 'Scenario')
    if (scenarioData) {
      scenario.value = cloneDeep(scenarioData) // Deep copy
    } else {
      error.value = 'Scenario not found'
    }
  } catch {
    error.value = 'Failed to load scenario'
  } finally {
    loading.value = false
  }
}

async function saveScenario() {
  if (!scenario.value) return

  saving.value = true
  try {
    await entityStore.assert(scenario.value)

    const toast = useToast()
    toast.add({
      title: '💾 Scenario Saved',
      description: `Scenario "${scenario.value.name}" has been saved.`,
      color: 'green'
    })
  } catch {
    const toast = useToast()
    toast.add({
      title: '❌ Error',
      description: 'Failed to save scenario',
      color: 'red'
    })
  } finally {
    saving.value = false
  }
}

function resetScenario() {
  loadScenario() // Just reload from store
}

function previewScenario() {
  const toast = useToast()
  toast.add({ title: 'Preview functionality coming soon!', color: 'blue' })
}

async function duplicateScenario() {
  if (!scenario.value) return

  try {
    const duplicate = entityStore.copy(scenarioId.value, { name: `${scenario.value.name} (Copy)` })
    const toast = useToast()
    toast.add({
      title: '📄 Scenario Duplicated',
      description: `Scenario "${duplicate.name}" has been created.`,
      color: 'green'
    })
    router.push(`/scenarios/${entityId(duplicate)}`)
  } catch {
    const toast = useToast()
    toast.add({
      title: '❌ Error',
      description: 'Failed to duplicate scenario',
      color: 'red'
    })
  }
}
</script>