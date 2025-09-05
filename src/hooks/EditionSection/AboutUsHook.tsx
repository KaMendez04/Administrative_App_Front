import { useEffect, useMemo, useState } from "react"
import type { AboutUsType } from "../../models/editionSection/AboutUsEditionType"
import { fetchAllAboutUs, slugifyTitle, upsertAboutUsSections, SECTION_DEFS } from "../../services/EditionSection/AboutUsService"

export function useAboutUsEdit() {
  const [records, setRecords] = useState<AboutUsType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Campos del formulario
  const [whoWeAre, setWhoWeAre] = useState("")
  const [mission, setMission]   = useState("")
  const [vision, setVision]     = useState("")

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await fetchAllAboutUs() // GET /aboutUs  :contentReference[oaicite:5]{index=5}
      setRecords(list)

      // Mapear por título (slug) a los 3 campos
      const map = new Map(list.map(i => [slugifyTitle(i.title), i]))
      setWhoWeAre(map.get(SECTION_DEFS[0].slug)?.description ?? "")
      setMission(  map.get(SECTION_DEFS[1].slug)?.description ?? "")
      setVision(   map.get(SECTION_DEFS[2].slug)?.description ?? "")
    } catch (e: any) {
      setError(e?.message ?? "Error cargando 'Sobre Nosotros'")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const saveAll = async () => {
    setSaving(true)
    setError(null)
    try {
      await upsertAboutUsSections({ whoWeAre, mission, vision })
      await load()
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar")
    } finally {
      setSaving(false)
    }
  }

  const isEditing = useMemo(() => records.length > 0, [records])

  return {
    loading, saving, error,
    whoWeAre, setWhoWeAre,
    mission, setMission,
    vision, setVision,
    isEditing,
    reload: load,
    saveAll,
  }
}
