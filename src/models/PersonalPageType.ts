export interface PersonalPageType {
  IdUser: number
  IDE: string
  name: string
  lastname1: string
  lastname2: string
  birthDate: string
  phone: string
  email: string
  direction: string
  occupation: string
  isActive: boolean

  startWorkDate?: string;           // 'YYYY-MM-DD'
  endWorkDate?: string | null;      // 'YYYY-MM-DD' | null
}

export const PersonalPageInitialState: PersonalPageType = {
  IdUser: 0,
  IDE: "",
  name: "",
  lastname1: "",
  lastname2: "",
  birthDate: "",
  phone: "",
  email: "",
  direction: "",
  occupation: "",
  isActive: true,

  startWorkDate: undefined,
  endWorkDate: null,
}

