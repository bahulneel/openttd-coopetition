import type { EntityOptions, Goal } from '~/types'

export function useGoalForm(initialData?: EntityOptions<Goal>) {
  const store = useEntityStore()
  const toast = useToast()

  // Initialize form with empty goal using updateEntity to properly merge
  const form = ref<Goal>(updateEntity(createGoal('New Goal', goalTemplate.newItem), initialData || {}))

  const save = () => {
    store.assert(form.value)
    toast.add({
      title: '✅ Goal Created',
      description: `Goal "${form.value.name || form.value.__id}" has been created successfully`,
      color: 'green',
    })
    return true
  }

  const reset = () => {
    form.value = createGoal('New Goal', goalTemplate.newItem)
  }

  return {
    form,
    save,
    reset,
  }
}
