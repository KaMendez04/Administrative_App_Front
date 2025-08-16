export interface AboutUsType {
  id: number
  title: string
  description: string
}

export const AboutUsInitialState: AboutUsUpdate = {
  title: "",
  description: ""
}

export type AboutUsUpdate = Omit<AboutUsType, 'id'>
