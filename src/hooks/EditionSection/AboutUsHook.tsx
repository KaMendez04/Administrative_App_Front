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
  const [mission, setMission] = useState("")
  const [vision, setVision] = useState("")

  // ✅ Valores iniciales para detectar cambios
  const [initialWhoWeAre, setInitialWhoWeAre] = useState("")
  const [initialMission, setInitialMission] = useState("")
  const [initialVision, setInitialVision] = useState("")

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await fetchAllAboutUs()
      setRecords(list)

      // Mapear por título (slug) a los 3 campos
      const map = new Map(list.map(i => [slugifyTitle(i.title), i]))
      const whoSlug = slugifyTitle(SECTION_DEFS[0].title)
      const missionSlug = slugifyTitle(SECTION_DEFS[1].title)
      const visionSlug = slugifyTitle(SECTION_DEFS[2].title)

      const whoWeAreValue = map.get(whoSlug)?.description ?? ""
      const missionValue = map.get(missionSlug)?.description ?? ""
      const visionValue = map.get(visionSlug)?.description ?? ""

      setWhoWeAre(whoWeAreValue)
      setMission(missionValue)
      setVision(visionValue)
      
      // ✅ Guardar valores iniciales
      setInitialWhoWeAre(whoWeAreValue)
      setInitialMission(missionValue)
      setInitialVision(visionValue)
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
      await load() // Esto recargará y actualizará los valores iniciales
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar")
    } finally {
      setSaving(false)
    }
  }

  const isEditing = useMemo(() => records.length > 0, [records])

  // ✅ Detectar si hay cambios
  const hasChanges = useMemo(() => {
    return (
      whoWeAre !== initialWhoWeAre ||
      mission !== initialMission ||
      vision !== initialVision
    )
  }, [whoWeAre, mission, vision, initialWhoWeAre, initialMission, initialVision])

  // ✅ Validar campos requeridos
  const canSave = useMemo(() => {
    return whoWeAre.trim() !== "" && mission.trim() !== "" && vision.trim() !== ""
  }, [whoWeAre, mission, vision])

  return {
    loading,
    saving,
    error,
    whoWeAre,
    setWhoWeAre,
    mission,
    setMission,
    vision,
    setVision,
    isEditing,
    reload: load,
    saveAll,
    hasChanges, 
    canSave,    
    initialWhoWeAre,
    initialMission,
    initialVision,
  }
}