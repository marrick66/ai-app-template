export interface ThinkingStep {
  type: 'thinking'
  html: string
  clippable?: boolean
}

export interface ActionStep {
  type: 'action'
  icon?: string
  label: string
  file?: string
}

export interface PresentStep {
  type: 'present'
  label: string
}

export interface DoneStep {
  type: 'done'
}

export type TimelineStep = ThinkingStep | ActionStep | PresentStep | DoneStep
