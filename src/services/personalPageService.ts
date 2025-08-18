import type { PersonalPageType } from "../models/PersonalPageType";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:3000";
// Si en Nest tienes app.setGlobalPrefix('api'), cambia a: const RESOURCE = "/api/personal";
const RESOURCE = "/personal";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T; // No Content
  return (await res.json()) as T;
}

export const personalApi = {
  // GET /personal
  list: () => http<PersonalPageType[]>(`${RESOURCE}`),

  // POST /personal
  create: (data: Omit<PersonalPageType, "id">) =>
    http<PersonalPageType>(`${RESOURCE}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // PUT /personal/:id
  update: (id: number, data: Partial<PersonalPageType>) =>
    http<PersonalPageType>(`${RESOURCE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // DELETE /personal/:id
  remove: (id: number) =>
    http<void>(`${RESOURCE}/${id}`, { method: "DELETE" }),
};

export async function fetchCedulaData(cedula: string) {
  const res = await fetch(`https://apis.gometa.org/cedulas/${cedula}`)
  if (!res.ok) throw new Error("Error al consultar la API")
  const data = await res.json()

  // Validación mínima
  if (!data.results || data.results.length === 0) throw new Error("Sin resultados")
  
  const persona = data.results[0]
  if (persona.fullname?.toUpperCase().includes("NO REGISTRADA")) {
    throw new Error("Cédula no registrada")
  }

  return persona
}

// Helper opcional si usas JWT
export const withAuth = (token?: string) =>
  token
    ? { headers: { Authorization: `Bearer ${token}` } as Record<string, string> }
    : {};
