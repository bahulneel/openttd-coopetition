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
            {{ campaign?.name }}
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
      </div>
    </div>

    <!-- Campaign Form -->
    <EntityCampaignInputDetails v-if="campaign" v-model="campaign">
      <template #actions>
        <div class="flex items-center justify-between pt-6 border-t border-border">
          <div class="flex items-center space-x-4">
            <div class="text-sm text-muted-foreground">
              {{ hasChanges ? '📝 Unsaved changes' : '✅ All changes saved' }}
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <Button type="button" variant="outline" class="openttd-button" @click="resetCampaign">
              ↺ Reset
            </Button>

            <Button type="button" :disabled="saving" class="openttd-button bg-openttd-green text-white"
              @click="saveCampaign">
              {{ saving ? '💾 Saving...' : '💾 Save Changes' }}
            </Button>
          </div>
        </div>
      </template>
    </EntityCampaignInputDetails>
  </div>
</template>

<script setup lang="ts">
import cloneDeep from 'lodash.clonedeep'
import type { Campaign } from '~/types'
import { entityId } from '~/utils/entities'

const route = useRoute()
const router = useRouter()
const campaignStore = useEntityStore()

// Simple state
const loading = ref(false)
const error = ref<string | undefined>(undefined)
const saving = ref(false)
const campaign = ref<Campaign | undefined>(undefined)

// Computed
const campaignId = computed(() => route.params.id as string)
const hasChanges = computed(() => {
  if (!campaign.value) return false
  const storeCampaign = campaignStore.get(campaignId.value, 'Campaign')
  return storeCampaign ? JSON.stringify(campaign.value) !== JSON.stringify(storeCampaign) : false
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
    const campaignData = await campaignStore.get(campaignId.value, 'Campaign')
    if (campaignData) {
      campaign.value = cloneDeep(campaignData) // Deep copy
    } else {
      error.value = 'Campaign not found'
    }
  } catch {
    error.value = 'Failed to load campaign'
  } finally {
    loading.value = false
  }
}

async function saveCampaign() {
  if (!campaign.value) return

  saving.value = true
  try {
    await campaignStore.assert(campaign.value)

    const toast = useToast()
    toast.add({
      title: '💾 Campaign Saved',
      description: `Campaign "${campaign.value.name}" has been saved.`,
      color: 'green'
    })
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
}

function resetCampaign() {
  loadCampaign() // Just reload from store
}

function previewCampaign() {
  const toast = useToast()
  toast.add({ title: 'Preview functionality coming soon!', color: 'blue' })
}

async function duplicateCampaign() {
  if (!campaign.value) return

  try {
    const duplicate = campaignStore.copy(campaignId.value, { name: `${campaign.value.name} (Copy)` })
    const toast = useToast()
    toast.add({
      title: '📄 Campaign Duplicated',
      description: `Campaign "${duplicate.name}" has been created.`,
      color: 'green'
    })
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
