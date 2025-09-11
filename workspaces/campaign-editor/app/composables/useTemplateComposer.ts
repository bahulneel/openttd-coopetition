import { goalTemplatePieces } from '../utils/model/goals'
import { scenarioTemplatePieces } from '../utils/model/scenarios'
import { campaignTemplatePieces } from '../utils/model/campaigns'
import { updateEntity } from '../utils/entities'
import type { TemplatePieces } from '../types'

export function useTemplateComposer(type: 'goal' | 'scenario' | 'campaign') {
  const selectedPieces = ref<string[]>(['defaults'])

  const templatePieces = computed(() => {
    switch (type) {
      case 'goal':
        return goalTemplatePieces
      case 'scenario':
        return scenarioTemplatePieces
      case 'campaign':
        return campaignTemplatePieces
      default:
        return {} as TemplatePieces
    }
  })

  const availablePieces = computed(() => {
    return Object.entries(templatePieces.value).map(([key, value]) => ({
      key,
      name: value.name,
      description: value.description,
      category: value.category,
      icon: value.icon,
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