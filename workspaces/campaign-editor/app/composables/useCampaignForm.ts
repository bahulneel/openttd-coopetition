import type { Campaign } from '~/types/campaign'
import type { EntityOptions } from '~/types/entity'

export function useCampaignForm(initialData?: EntityOptions<Campaign>) {
  const store = useEntityStore()
  const toast = useToast()

  // Initialize form with empty campaign using updateEntity to properly merge
  const form = ref<Campaign>(updateEntity(createCampaign('New Campaign', campaignTemplate.newItem), initialData || {}))

  const save = () => {
    store.assert(form.value)
    toast.add({
      title: '✅ Campaign Created',
      description: `Campaign "${form.value.meta?.title || form.value.__id}" has been created successfully`,
      color: 'green',
    })
    return true
  }

  const reset = () => {
    form.value = createCampaign('New Campaign', campaignTemplate.newItem)
  }

  return {
    form,
    save,
    reset,
  }
}
