export type Extraordinary = {
  id: number
  name: string
  amount: string
  used: string
  date?: string | null
  createdAt?: string
  updatedAt?: string
  canEditAmount?: boolean
}

export type UpdateExtraordinaryPayload = {
  name?: string
  date?: string | null
  amount?: string
}

export type FormValues = {
  name: string
  amount: string
  date: string
}

export const initialState: FormValues = {
  name: "",
  amount: "",
  date: "",
}