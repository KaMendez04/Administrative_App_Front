export interface ServicesInformative {
  id: number
  title: string
  cardDescription: string
  modalDescription: string
  image: string
}

export type ServicesInformativeInput = Omit<ServicesInformative, 'id'>