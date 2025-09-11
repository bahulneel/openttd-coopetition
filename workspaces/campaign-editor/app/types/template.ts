export type TemplateCategory = 
  | 'basic'
  | 'objective'
  | 'infrastructure'
  | 'theme'
  | 'multiplayer'
  | 'progression'
  | 'learning'

export interface TemplatePiece<T = any> {
  name: string
  description: string
  category: TemplateCategory
  icon: string
  data: T
}

export type TemplatePieces<T = any> = Record<string, TemplatePiece<T>>