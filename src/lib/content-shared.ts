export const STATUS_LABEL: Record<string, string> = {
  live: 'Live',
  building: 'SI. Is still crafting',
  concept: 'Concept',
  archived: 'Completed',
}

/** Projects with this stage are shown with minimal information. */
export const isCrafting = (stage?: string | null) => stage === 'building'

export const ACCENT_RGB: Record<string, string> = {
  green: '90 110 75',
  cyan: '71 105 122',
  amber: '138 94 18',
  violet: '123 75 99',
  rose: '185 71 42',
}
