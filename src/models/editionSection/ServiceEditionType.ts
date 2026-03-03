export interface ServicesInformative {
  id: number
  title: string
  cardDescription: string
  modalDescription: string
  images: string[] 
}

export type ServicesInformativeInput = Omit<ServicesInformative, "id">