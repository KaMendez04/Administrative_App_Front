export interface PrincipalEdition {
  id: number
  title: string
  description: string
}

export type PrincipalUpdate = Omit<PrincipalEdition, 'id'>
