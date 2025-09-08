import type { Goal, Scenario } from '~/types'
import type { EntityOptions } from '~/types/entity'

export function useScenarioForm(initialData?: EntityOptions<Scenario>) {
  const store = useEntityStore()
  const toast = useToast()

  // Initialize form with empty scenario using updateEntity to properly merge
  const form = ref<Scenario>(updateEntity(createScenario('New Scenario', scenarioTemplate.newItem), initialData || {}))

  // Track selected goals
  const selectedGoals = ref<string[]>([])

  // Available goals for selection
  const availableGoals = computed(() => store.select('Goal').value)

  // Helper function for goal type badges
  function getGoalTypeBadgeClass(type: string | undefined) {
    switch (type) {
      case 'player':
        return 'bg-openttd-blue text-white'
      case 'company':
        return 'bg-openttd-purple text-white'
      case 'scenario':
        return 'bg-openttd-orange text-white'
      case 'campaign':
        return 'bg-openttd-red text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const save = () => {
    // Convert selected goals to scenario goal format
    form.value.goals = selectedGoals.value.map((goalId) => ({
      include: entityRef<Goal>(goalId, 'Goal'),
      order: 0,
      required: true,
    }))

    store.assert(form.value)
    toast.add({
      title: '✅ Scenario Created',
      description: `Scenario "${form.value.name}" has been created successfully`,
      color: 'green',
    })
    return true
  }

  const reset = () => {
    form.value = createScenario('New Scenario', scenarioTemplate.newItem)
    selectedGoals.value = []
  }

  return {
    form,
    selectedGoals,
    availableGoals,
    getGoalTypeBadgeClass,
    save,
    reset,
  }
}
