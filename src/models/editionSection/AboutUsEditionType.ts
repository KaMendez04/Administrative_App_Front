export interface AboutUsEdition {
  id: number
  title: string
  description: string
}

export type AboutUsUpdate = Omit<AboutUsEdition, 'id'>
