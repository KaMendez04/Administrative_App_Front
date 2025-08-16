import type { AboutUsType } from "../../models/editionSection/AboutUsEditionType"

const API_BASE = (import.meta as any)?.env?.VITE_API_URL ?? "http://localhost:3000"
const BASE_URL = `${API_BASE}/aboutUs`

export async function getAllAboutUs(): Promise<AboutUsType[]> {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error("Error al obtener Sobre Nosotros")
  return res.json();
}

export async function updateAboutUs(id: number, description: string): Promise<AboutUsType> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  })
  if (!res.ok) throw new Error("No se pudo actualizar Sobre Nosotros")
  return res.json()
}


