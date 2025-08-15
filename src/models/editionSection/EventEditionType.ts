export interface EventEdition {
  id: number
  title: string
  date: string
  description: string
  illustration: string
}

export type EventInput = Omit<EventEdition, 'id'>