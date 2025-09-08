<template>
  <div v-if="loading" class="flex justify-center py-12">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
      <p class="text-muted-foreground">Loading campaign...</p>
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
      <Button variant="outline" class="openttd-button" @click="$router.back()">
        ← Go Back
      </Button>
    </div>
  </div>

  <div v-else class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center space-x-4">
        <Button variant="ghost" size="sm" class="openttd-button" @click="$router.back()">
          ← Back
        </Button>

        <div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ formData.name }}
          </h1>
          <p class="text-muted-foreground">
            Edit campaign details and configuration
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <Button variant="outline" class="openttd-button" @click="duplicateCampaign">
          📄 Duplicate
        </Button>

        <Button variant="outline" class="openttd-button" @click="previewCampaign">
          👁️ Preview
        </Button>

        <Button :disabled="!meta.valid || saving" class="openttd-button bg-openttd-green text-white"
          @click="saveCampaign">
          {{ saving ? '💾 Saving...' : '💾 Save Changes' }}
        </Button>
      </div>
    </div>

    <!-- Form -->
    <form class="space-y-6" @submit.prevent="saveCampaign">
      <EntityCampaignInputDetails :form-data="formData" @update:form-data="updateFormData">
        <template #actions>
          <div class="flex items-center justify-between pt-6 border-t border-border">
            <div class="flex items-center space-x-4">
              <div class="text-sm text-muted-foreground">
                {{ hasChanges ? '📝 Unsaved changes' : '✅ All changes saved' }}
              </div>

              <div v-if="customValidationErrors.length > 0" class="flex items-center space-x-2">
                <span class="text-destructive text-sm">⚠️ {{ customValidationErrors.length }} validation errors</span>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <Button type="button" variant="outline" class="openttd-button" @click="resetForm">
                ↺ Reset
              </Button>

              <Button type="submit" :disabled="!meta.valid || saving" class="openttd-button bg-openttd-green text-white"
                @click="saveCampaign">
                {{ saving ? '💾 Saving...' : '💾 Save Changes' }}
              </Button>
            </div>
          </div>
        </template>
      </EntityCampaignInputDetails>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import type { Campaign, CampaignScenario, EntityValue } from '~/types'
import { entityId } from '~/utils/entities'

const route = useRoute()
const router = useRouter()
const campaignStore = useEntityStore()

// Reactive data
const loading = ref(false)
const error = ref<string | undefined>(undefined)
const saving = ref(false)

// Form setup
const form = useForm({
  validationSchema: campaignSchema,
  initialValues: {
    name: '',
    meta: {
      description: '',
      difficulty: 'medium' as const,
      tags: [],
    },
    scenarios: [],
  } satisfies EntityValue<Campaign>
})

const { values: formData, meta, setValues } = form

// Computed
const campaignId = computed(() => route.params.id as string)
const hasChanges = computed(() => meta.value.dirty)

// Custom validation errors
const customValidationErrors = computed(() => {
  const errors: string[] = []
  // Add custom validation logic here if needed
  return errors
})

// Load campaign on mount
onMounted(async () => {
  await loadCampaign()
})

// Methods
async function loadCampaign() {
  loading.value = true
  error.value = undefined

  try {
    const campaign = await campaignStore.get(campaignId.value, 'Campaign')
    if (campaign) {
      // Transform Campaign type to form schema
      form.setValues({
        id: entityId(campaign),
        ...toEntityValue(campaign),
      })
    } else {
      error.value = 'Campaign not found'
    }
  } catch {
    error.value = 'Failed to load campaign'
  } finally {
    loading.value = false
  }
}

const saveCampaign = form.handleSubmit(async (values) => {
  saving.value = true

  try {
    await campaignStore.assert(asCampaign(values))

    const toast = useToast()
    toast.add({
      title: '💾 Campaign Saved',
      description: `Campaign "${values.name}" has been saved.`,
      color: 'green'
    })

    // Reload the campaign to get updated data
    await loadCampaign()
  } catch {
    const toast = useToast()
    toast.add({
      title: '❌ Error',
      description: 'Failed to save campaign',
      color: 'red'
    })
  } finally {
    saving.value = false
  }
})

function updateFormData(newData: Campaign) {
  setValues(newData)
}

function resetForm() {
  loadCampaign()
}

function previewCampaign() {
  // TODO: Implement preview functionality
  const toast = useToast()
  toast.add({ title: 'Preview functionality coming soon!', color: 'blue' })
}

async function duplicateCampaign() {
  try {
    const duplicate = campaignStore.copy(campaignId.value, { name: `${formData.name} (Copy)` })
    const toast = useToast()
    toast.add({
      title: '📄 Campaign Duplicated',
      description: `Campaign "${duplicate.name}" has been created.`,
      color: 'green'
    })
    // Navigate to the duplicated campaign
    router.push(`/campaigns/${entityId(duplicate)}`)
  } catch {
    const toast = useToast()
    toast.add({
      title: '❌ Error',
      description: 'Failed to duplicate campaign',
      color: 'red'
    })
  }
}
</script>
