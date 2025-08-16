import { useEffect, useState } from "react"
import { getAllAboutUs, updateAboutUs } from "../../services/EditionSection/AboutUsService"
import type { AboutUsType } from "../../models/editionSection/AboutUsEditionType"

export function useAboutUsEdit() {
   const [items, setItems] = useState<AboutUsType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedId, setSelectedId] = useState<number | null>(null) // <-- ahora con setter
  const [isEditing, setIsEditing] = useState(false)

  // Cargar datos al seleccionar un elemento
  useEffect(() => { (async () => {
    try {
      const data = await getAllAboutUs()
      setItems(data)
    } catch(e:any){
      setError(e?.message ?? "Error cargando datos")
    } finally {
      setLoading(false)
    }
  })() }, [])

  // Cargar datos al seleccionar un elemento
  const selected = items.find(item => item.id === selectedId) ?? null

  // Guardar cambios
  async function saveDescription(description: string){
    if(!selected) return
    setSaving(true)
    setError(null)
    try {
      await updateAboutUs(selected.id, description)
      const refreshed = await getAllAboutUs()
      setItems(refreshed)
      setIsEditing(false)
    } catch (e: any) {
      setError(e?.message ?? "Error guardando datos")
    } finally {
      setSaving(false)
    }
  }

  return {
    items,
    loading,
    saving,
    error,
    selected,
    selectedId,
    setSelectedId,
    isEditing,
    setIsEditing,
    saveDescription,
  }
}
