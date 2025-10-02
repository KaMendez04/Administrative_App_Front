import apiConfig from "../../apiConfig/apiConfig"
import type { AboutUsType, AboutUsUpdate } from "../../models/editionSection/AboutUsEditionType"

// Títulos fijos para cada sección (los usaremos como “clave”)
export const SECTION_DEFS = [
  { slug: "quienes-somos", title: "Quiénes Somos" },
  { slug: "mision",        title: "Misión" },
  { slug: "vision",        title: "Visión" },
]

// Slug simple para emparejar por título sin depender de acentos/espacios
export function slugifyTitle(t: string) {
  return (t || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export async function fetchAllAboutUs(): Promise<AboutUsType[]> {
  const { data } = await apiConfig.get<AboutUsType[]>("/aboutUs")
  return Array.isArray(data) ? data : []
}

export async function createAboutUs(input: AboutUsUpdate): Promise<AboutUsType> {
  const { data } = await apiConfig.post<AboutUsType>("/aboutUs", input)
  return data
}

export async function updateAboutUs(id: number, input: AboutUsUpdate) {
  const { data } = await apiConfig.put(`/aboutUs/${id}`, input)
  return data
}

export async function upsertAboutUsSections(payload: {
  whoWeAre: string
  mission: string
  vision: string
}) {
  const list = await fetchAllAboutUs()
  const bySlug = new Map<string, AboutUsType>()
  for (const item of list) {
    bySlug.set(slugifyTitle(item.title), item)
  }

  const plan = [
    { def: SECTION_DEFS[0], description: payload.whoWeAre },
    { def: SECTION_DEFS[1], description: payload.mission },
    { def: SECTION_DEFS[2], description: payload.vision  },
  ]

  for (const { def, description } of plan) {
    const existing = bySlug.get(def.slug)
    const body: AboutUsUpdate = { title: def.title, description: description ?? "" }

    if (existing) {
      await updateAboutUs(existing.id, body) // PUT /aboutUs/:id  :contentReference[oaicite:3]{index=3}
    } else {
      await createAboutUs(body)              // POST /aboutUs       :contentReference[oaicite:4]{index=4}
    }
  }
}
