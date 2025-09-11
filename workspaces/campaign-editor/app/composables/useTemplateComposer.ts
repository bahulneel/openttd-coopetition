import { goalTemplatePieces } from '../utils/model/goals'
import { scenarioTemplatePieces } from '../utils/model/scenarios'
import { campaignTemplatePieces } from '../utils/model/campaigns'
import type { TemplatePieces } from '../types'
import defu from 'defu'

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
    const entries = Object.entries(templatePieces.value)
    return entries.reduce((acc, [key, value]) => {
      acc[key] = {
        name: value.name,
        description: value.description,
        category: value.category,
        icon: value.icon,
        data: value.data,
      }
      return acc
    }, {} as Record<string, { name: string; description: string; category: string; icon: string; data: unknown }>)
  })

  const selectedPiecesData = computed(() => {
    return selectedPieces.value.map(key => {
      const piece = templatePieces.value[key as keyof typeof templatePieces.value]
      return piece ? piece.data : {}
    })
  })

  const composedTemplate = computed(() => {
    const base = templatePieces.value.defaults?.data || {}
    return selectedPiecesData.value.reduce((acc, piece) => {
      // Merge the pieces using defu for proper deep merging
      return defu(piece as Record<string, unknown>, acc as Record<string, unknown>)
    }, base)
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