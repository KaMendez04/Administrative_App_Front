// src/services/EditionSection/ServicesInformativeService.ts

import type { ServicesInformative, ServicesInformativeInput } from "../../models/editionSection/ServiceEditionType"

const API_BASE = (import.meta as any)?.env?.VITE_API_URL ?? "http://localhost:3000"
const BASE = `${API_BASE}/servicesInformative` // ← coincide con tu controlador
// GET /servicesInformative, GET /:id, POST, PUT /:id, DELETE /:id  :contentReference[oaicite:4]{index=4}

export async function fetchServices(): Promise<ServicesInformative[]> {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error("Error al listar servicios")
  return res.json()
}

export async function getService(id: number): Promise<ServicesInformative> {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error("Servicio no encontrado")
  return res.json()
}

export async function createService(input: ServicesInformativeInput): Promise<ServicesInformative> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error("No se pudo crear el servicio")
  return res.json()
}

export async function updateService(id: number, input: ServicesInformativeInput) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error("No se pudo actualizar el servicio")
  // Tu backend devuelve UpdateResult por defecto. :contentReference[oaicite:5]{index=5}
  return res.json()
}

export async function deleteService(id: number) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("No se pudo eliminar el servicio")
  // Devuelve DeleteResult. :contentReference[oaicite:6]{index=6}
  return res.json()
}
