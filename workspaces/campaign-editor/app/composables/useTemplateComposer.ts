import type { EntityOptions } from '../types'
import { composeTemplate, getTemplatePieces } from '../utils/templates'

export function useTemplateComposer(type: 'goal' | 'scenario' | 'campaign') {
  const selectedPieces = ref<string[]>(['basic'])
  const templatePieces = getTemplatePieces(type)

  const availablePieces = computed(() => {
    return Object.entries(templatePieces).map(([key, value]) => ({
      key,
      name: value.name,
      description: value.description,
      data: value.data,
    }))
  })

  const selectedPiecesData = computed(() => {
    return selectedPieces.value.map(key => {
      const piece = (templatePieces as any)[key]
      return piece ? piece.data : {}
    })
  })

  const composedTemplate = computed(() => {
    const base = (templatePieces as any).basic.data
    return composeTemplate(base, selectedPiecesData.value)
  })

  function updateSelectedPieces(pieces: string[]) {
    selectedPieces.value = pieces
  }

  function togglePiece(key: string) {
    if (selectedPieces.value.includes(key)) {
      selectedPieces.value = selectedPieces.value.filter(k => k !== key)
    } else {
      selectedPieces.value = [...selectedPieces.value, key]
    }
  }

  function clearAll() {
    selectedPieces.value = ['basic']
  }

  function selectAll() {
    selectedPieces.value = Object.keys(templatePieces)
  }

  function reset() {
    selectedPieces.value = ['basic']
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