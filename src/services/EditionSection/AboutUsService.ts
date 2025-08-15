import type { AboutUsEdition, AboutUsUpdate } from "../../models/editionSection/AboutUsEditionType"

const API_BASE = (import.meta as any)?.env?.VITE_API_URL ?? "http://localhost:3000"
const BASE = `${API_BASE}/aboutUs`

// Si manejas un único registro de "Sobre Nosotros":
export async function fetchSingleAboutUs(): Promise<AboutUsEdition | null> {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error("Error al obtener Sobre Nosotros")
  const list: AboutUsEdition[] = await res.json()
  return list.length ? list[0] : null
}

export async function updateAboutUs(id: number, input: AboutUsUpdate) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error("No se pudo actualizar Sobre Nosotros")
  // Tu servicio devuelve UpdateResult por defecto
  return res.json()
}
