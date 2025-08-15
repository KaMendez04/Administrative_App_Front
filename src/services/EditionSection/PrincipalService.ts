import type { PrincipalEdition, PrincipalUpdate } from "../../models/editionSection/PrincipalEditionType"

const API_BASE = (import.meta as any)?.env?.VITE_API_URL ?? "http://localhost:3000"
const BASE = `${API_BASE}/principal`

export async function fetchSinglePrincipal(): Promise<PrincipalEdition | null> {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error("Error al obtener principal")
  const list: PrincipalEdition[] = await res.json()
  return list.length ? list[0] : null
}

export async function updatePrincipal(id: number, input: PrincipalUpdate) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error("No se pudo actualizar principal")
  // Tu backend devuelve UpdateResult (no la entidad). 
  return res.json()
}
