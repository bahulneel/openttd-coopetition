import { goalTemplate } from '../utils/model/goals'
import { scenarioTemplate } from '../utils/model/scenarios'
import { campaignTemplate } from '../utils/model/campaigns'
import { updateEntity } from '../utils/entities'

export function useTemplateComposer(type: 'goal' | 'scenario' | 'campaign') {
  const selectedPieces = ref<string[]>(['defaults'])

  const templatePieces = computed(() => {
    switch (type) {
      case 'goal':
        return {
          defaults: {
            name: 'Basic Goal',
            description: 'Minimal goal with just required fields',
            data: goalTemplate.defaults,
          },
          newItem: {
            name: 'Complete Goal',
            description: 'Goal with all default values and settings',
            data: goalTemplate.newItem,
          },
        }
      case 'scenario':
        return {
          defaults: {
            name: 'Basic Scenario',
            description: 'Minimal scenario with just required fields',
            data: scenarioTemplate.defaults,
          },
          newItem: {
            name: 'Complete Scenario',
            description: 'Scenario with all default values and settings',
            data: scenarioTemplate.newItem,
          },
        }
      case 'campaign':
        return {
          defaults: {
            name: 'Basic Campaign',
            description: 'Minimal campaign with just required fields',
            data: campaignTemplate.defaults,
          },
          newItem: {
            name: 'Complete Campaign',
            description: 'Campaign with all default values and settings',
            data: campaignTemplate.newItem,
          },
        }
      default:
        return {}
    }
  })

  const availablePieces = computed(() => {
    return Object.entries(templatePieces.value).map(([key, value]) => ({
      key,
      name: value.name,
      description: value.description,
      data: value.data,
    }))
  })

  const selectedPiecesData = computed(() => {
    return selectedPieces.value.map(key => {
      const piece = templatePieces.value[key as keyof typeof templatePieces.value]
      return piece ? piece.data : {}
    })
  })

  const composedTemplate = computed(() => {
    const base = templatePieces.value.defaults?.data || {}
    return selectedPiecesData.value.reduce((acc, piece) => updateEntity(acc as any, piece), base)
  })

  function updateSelectedPieces(pieces: string[]) {
    // Always keep 'defaults' selected
    const newPieces = pieces.includes('defaults') ? pieces : ['defaults', ...pieces]
    selectedPieces.value = newPieces
  }

  function togglePiece(key: string) {
    if (key === 'defaults') return // Can't deselect defaults

    if (selectedPieces.value.includes(key)) {
      selectedPieces.value = selectedPieces.value.filter(k => k !== key)
    } else {
      selectedPieces.value = [...selectedPieces.value, key]
    }
  }

  function clearAll() {
    selectedPieces.value = ['defaults']
  }

  function selectAll() {
    selectedPieces.value = Object.keys(templatePieces.value)
  }

  function reset() {
    selectedPieces.value = ['defaults']
  }

  return {
    selectedPieces,
    templatePieces,
    availablePieces,
    selectedPiecesData,
    composedTemplate,
    updateSelectedPieces,
    togglePiece,
    clearAll,
    selectAll,
    reset,
  }
}