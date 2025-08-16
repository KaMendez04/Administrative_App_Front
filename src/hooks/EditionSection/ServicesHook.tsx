// src/hooks/editionSection/ServicesInformativeHook.tsx
import { useEffect, useState } from "react"
import type { ServicesInformative, ServicesInformativeInput } from "../../models/editionSection/ServiceEditionType"
import { createService, deleteService, fetchServices, updateService } from "../../services/EditionSection/ServicesInformativeService"

export function useServicesInformative() {
  const [items, setItems] = useState<ServicesInformative[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = items.find(i => i.id === selectedId) ?? null
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await fetchServices()
      setItems(list)
    } catch (e: any) {
      setError(e?.message ?? "Error cargando servicios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (input: ServicesInformativeInput) => {
    const created = await createService(input)
    await load()
    setSelectedId(created.id) // ← ver inmediatamente el creado
  }

  const handleUpdate = async (entity: ServicesInformative) => {
    const { id, ...input } = entity
    await updateService(id, input)
    await load()
  }

  const handleDelete = async (id: number) => {
    await deleteService(id)
    await load()
    setSelectedId(null)
  }

  return { items, selected, selectedId, setSelectedId, handleCreate, handleUpdate, handleDelete, loading, error, reload: load }
}
