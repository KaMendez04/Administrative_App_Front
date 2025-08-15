import type { EventEdition, EventInput } from "../../models/editionSection/EventEditionType"

const API_BASE = (import.meta as any)?.env?.VITE_API_URL ?? "http://localhost:3000"
const BASE = `${API_BASE}/event` // ← tu backend expone /event

export async function fetchEvents(): Promise<EventEdition[]> {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error("Error al listar eventos")
  return res.json()
}

export async function createEvent(input: EventInput): Promise<EventEdition> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input), // date en 'YYYY-MM-DD'
  })
  if (!res.ok) throw new Error("No se pudo crear el evento")
  return res.json()
}

export async function updateEvent(id: number, input: EventInput): Promise<any> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error("No se pudo actualizar el evento")
  // Tu backend responde UpdateResult; si quieres la entidad, vuelve a consultar fetchEvents() luego
  return res.json()
}

export async function deleteEvent(id: number): Promise<any> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("No se pudo eliminar el evento")
  return res.json()
}
