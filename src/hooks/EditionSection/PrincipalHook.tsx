import { useEffect, useState } from "react"
import type { PrincipalEdition, PrincipalUpdate } from "../../models/editionSection/PrincipalEditionType"
import { fetchSinglePrincipal, updatePrincipal } from "../../services/EditionSection/PrincipalService"

export function usePrincipalEdit() {
  const [data, setData] = useState<PrincipalEdition | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const p = await fetchSinglePrincipal()
      setData(p)
    } catch (e: any) {
      setError(e?.message ?? "Error cargando principal")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const save = async (input: PrincipalUpdate) => {
    if (!data) return
    setSaving(true)
    setError(null)
    try {
      await updatePrincipal(data.id, input)
      // re-cargar para ver valores actuales del backend (opcional)
      await load()
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar")
    } finally {
      setSaving(false)
    }
  }

  return { data, loading, saving, error, save, reload: load }
}
