export type TemplateCategory = 
  | 'basic'
  | 'objective'
  | 'infrastructure'
  | 'theme'
  | 'multiplayer'
  | 'progression'
  | 'learning'

export interface TemplatePiece<T = unknown> {
  name: string
  description: string
  category: TemplateCategory
  icon: string
  data: T
}

export type TemplatePieces<T = unknown> = Record<string, TemplatePiece<T>>