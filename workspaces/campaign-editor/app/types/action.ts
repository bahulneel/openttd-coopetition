export type ActionVariant = 'brown' | 'green' | 'purple' | 'blue'

export type ActionType = 'button' | 'link'

export interface ActionInfo {
  label: string
  variant: ActionVariant
}

export interface Action extends ActionInfo {
  type: ActionType
  // For 'link' actions
  to?: string
  // For 'button' actions
  disabled?: boolean
  action?: () => void
}
