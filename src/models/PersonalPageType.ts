// src/models/PersonalPageType.ts

export interface PersonalPageType {
  IdUser: number
  IDE: string
  name: string
  lastname1: string
  lastname2: string
  birthdate: string
  phone: string
  email: string
  direction: string
  occupation: string
  isActive: boolean
}

export const personalPages: PersonalPageType[] = [
  {
    IdUser: 1,
    IDE: "509870567",
    name: "Greilyn",
    lastname1: "Esquivel",
    lastname2: "Salazar",
    birthdate: "1995-06-20",
    phone: "60345678",
    email: "greilyn@ejemplo.com",
    direction: "Nicoya",
    occupation: "Secretaria",
    isActive: true,
  },
  {
    IdUser: 2,
    IDE: "501230654",
    name: "Angélica",
    lastname1: "Ortiz",
    lastname2: "Barrantes",
    birthdate: "1992-04-10",
    phone: "84558012",
    email: "angelica@ejemplo.com",
    direction: "Santa Cruz",
    occupation: "Administradora",
    isActive: false,
  },
  {
    IdUser: 3,
    IDE: "504500674",
    name: "Katheryn",
    lastname1: "Méndez",
    lastname2: "Quirós",
    birthdate: "1990-09-12",
    phone: "12345678",
    email: "katheryn@ejemplo.com",
    direction: "Hojancha",
    occupation: "Contadora",
    isActive: false,
  },
  {
    IdUser: 4,
    IDE: "507890123",
    name: "Krystel",
    lastname1: "Salazar",
    lastname2: "Chavarría",
    birthdate: "1993-11-01",
    phone: "65432109",
    email: "krystel@ejemplo.com",
    direction: "Liberia",
    occupation: "Coordinadora",
    isActive: true,
  },
  {
    IdUser: 5,
    IDE: "503456789",
    name: "Marvin",
    lastname1: "Méndez",
    lastname2: "Cruz",
    birthdate: "1991-01-15",
    phone: "71234567",
    email: "marvin@ejemplo.com",
    direction: "Carrillo",
    occupation: "Soporte Técnico",
    isActive: false,
  },
]
