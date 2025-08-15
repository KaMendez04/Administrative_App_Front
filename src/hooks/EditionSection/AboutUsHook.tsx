import { useEffect, useState } from "react"
import type { AboutUsEdition, AboutUsUpdate } from "../../models/editionSection/AboutUsEditionType"
import { fetchSingleAboutUs, updateAboutUs } from "../../services/EditionSection/AboutUsService"

export function useAboutUsEdit() {
  const [data, setData] = useState<AboutUsEdition | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const a = await fetchSingleAboutUs()
      setData(a)
    } catch (e: any) {
      setError(e?.message ?? "Error cargando datos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const save = async (input: AboutUsUpdate) => {
    if (!data) return
    setSaving(true)
    setError(null)
    try {
      await updateAboutUs(data.id, input)
      await load() // refrescar (tu backend retorna UpdateResult)
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar")
    } finally {
      setSaving(false)
    }
  }

  return { data, loading, saving, error, save, reload: load }
}
