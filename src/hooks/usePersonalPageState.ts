import { useCallback, useState } from "react"
import type { PersonalPageType } from "../models/PersonalPageType"

function createEmptyPersonalPage(): PersonalPageType {
  return {
    IdUser: Date.now(),
    IDE: "",
    name: "",
    lastname1: "",
    lastname2: "",
    birthdate: "",
    phone: "",
    email: "",
    direction: "",
    occupation: "",
    isActive: true,
  }
}

export function usePersonalPageState() {
  const [search, setSearch] = useState("")
  const [selectedPersonalPage, setSelectedPersonalPage] = useState<PersonalPageType | null>(null)
  const [editPersonalPage, setEditPersonalPage] = useState<PersonalPageType | null>(null)
  const [newPersonalPage, setNewPersonalPage] = useState<PersonalPageType | null>(null)

  const openNewPersonalPage = useCallback(() => {
    setNewPersonalPage(createEmptyPersonalPage())
  }, [])

  return {
    search,
    setSearch,
    selectedPersonalPage,
    setSelectedPersonalPage,
    editPersonalPage,
    setEditPersonalPage,
    newPersonalPage,
    setNewPersonalPage,
    openNewPersonalPage,
  }
}
