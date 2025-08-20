import { useCallback, useState } from "react"
import { PersonalPageInitialState, type PersonalPageType } from "../../models/PersonalPageType"


// Mapea el objeto de la UI (birthdate) al payload de API (birthDate) para CREATE
export function toCreateApiPayload(p: PersonalPageType): Omit<PersonalPageType, "id"> {
  return {
  IDE: p.IDE.trim(),
  name: p.name.trim(),
  lastname1: p.lastname1.trim(),
  lastname2: p.lastname2.trim(),
  birthDate: p.birthDate, // <- mapeo UI -> API
  phone: p.phone.trim(),
  email: p.email.trim(),
  direction: p.direction.trim(),
  occupation: p.occupation.trim(),
  IdUser: 0,
  isActive: false
}
}

// Mapea un patch parcial de UI al payload parcial de API para UPDATE
export function toUpdateApiPayload(p: Partial<PersonalPageType>): Partial<PersonalPageType> {
  const out: Partial<PersonalPageType> = {}
  if (p.IDE !== undefined) out.IDE = p.IDE
  if (p.name !== undefined) out.name = p.name
  if (p.lastname1 !== undefined) out.lastname1 = p.lastname1
  if (p.lastname2 !== undefined) out.lastname2 = p.lastname2
  if (p.birthDate !== undefined) out.birthDate = p.birthDate // <- mapeo UI -> API
  if (p.phone !== undefined) out.phone = p.phone
  if (p.email !== undefined) out.email = p.email
  if (p.direction !== undefined) out.direction = p.direction
  if (p.occupation !== undefined) out.occupation = p.occupation
  return out
}

export function usePersonalPageState() {
  const [search, setSearch] = useState("")
  const [selectedPersonalPage, setSelectedPersonalPage] = useState<PersonalPageType | null>(null)
  const [editPersonalPage, setEditPersonalPage] = useState<PersonalPageType | null>(null)
  const [newPersonalPage, setNewPersonalPage] = useState<PersonalPageType | null>(null)

  const openNewPersonalPage = useCallback(() => {
    // Usa un IdUser temporal para la UI (no se envía al backend)
    setNewPersonalPage({ ...PersonalPageInitialState, IdUser: Date.now() })
  }, [])

  const closeModals = useCallback(() => {
    setSelectedPersonalPage(null)
    setEditPersonalPage(null)
    setNewPersonalPage(null)
  }, [])

  return {
    // búsqueda
    search,
    setSearch,
    // modales
    selectedPersonalPage,
    setSelectedPersonalPage,
    editPersonalPage,
    setEditPersonalPage,
    newPersonalPage,
    setNewPersonalPage,
    openNewPersonalPage,
    closeModals,
  }
}
