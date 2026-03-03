import {
  getApprovedVoluntariadoDocumentsLink,
  getSolicitudVoluntariadoDocumentsLink,
} from "@/services/Volunteers/volunteerService"
import { useMutation, useQuery } from "@tanstack/react-query"

// ─── Verifica si una solicitud tiene documentos (sin lanzar error al consumidor) ───
export function useSolicitudHasDocs(idSolicitud: number | null | undefined) {
  return useQuery({
    queryKey: ["solicitud-docs-check", idSolicitud],
    enabled: !!idSolicitud,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 min — evita llamadas repetidas al mismo modal
    queryFn: async () => {
      try {
        await getSolicitudVoluntariadoDocumentsLink(idSolicitud!)
        // Si resuelve, hay docs
        return true
      } catch {
        // Cualquier error (400, 404) = no hay docs o no hay carpeta
        return false
      }
    },
  })
}

// ─── Mutación para abrir la carpeta al hacer clic ───
export function useSolicitudVoluntariadoDocsLink() {
  return useMutation({
    mutationFn: (idSolicitud: number) =>
      getSolicitudVoluntariadoDocumentsLink(idSolicitud),
  })
}

export function useApprovedVolunteerDocsLink() {
  return useMutation({
    mutationFn: (params: { tipo: "INDIVIDUAL" | "ORGANIZACION"; id: number }) =>
      getApprovedVoluntariadoDocumentsLink(params),
  })
}

// ─── Verifica si un voluntario/organización aprobado tiene documentos ───
export function useApprovedHasDocs(
  params: { tipo: "INDIVIDUAL" | "ORGANIZACION"; id: number } | null | undefined
) {
  return useQuery({
    queryKey: ["approved-docs-check", params?.tipo, params?.id],
    enabled: !!params?.id,
    retry: false,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      try {
        await getApprovedVoluntariadoDocumentsLink(params!)
        return true
      } catch {
        return false
      }
    },
  })
}