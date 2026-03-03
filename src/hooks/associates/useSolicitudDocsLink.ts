import {
  getDocsLinkByAsociado,
  getDocsLinkBySolicitud,
} from "@/services/Associates/adminSolicitudesService";
import { useMutation, useQuery } from "@tanstack/react-query";

// ─── Verifica si un asociado tiene documentos (sin lanzar error al consumidor) ───
export function useAsociadoHasDocs(idAsociado: number | null | undefined) {
  return useQuery({
    queryKey: ["asociado-docs-check", idAsociado],
    enabled: !!idAsociado,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 min — evita llamadas repetidas al mismo modal
    queryFn: async () => {
      try {
        await getDocsLinkByAsociado(idAsociado!);
        return true;
      } catch {
        return false;
      }
    },
  });
}

// ─── Verifica si una solicitud tiene documentos ───
export function useSolicitudHasDocs(idSolicitud: number | null | undefined) {
  return useQuery({
    queryKey: ["solicitud-docs-check", idSolicitud],
    enabled: !!idSolicitud,
    retry: false,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      try {
        await getDocsLinkBySolicitud(idSolicitud!);
        return true;
      } catch {
        return false;
      }
    },
  });
}

// ─── Mutaciones para abrir la carpeta al hacer clic ───
export const useDocsLinkByAsociado = () =>
  useMutation({ mutationFn: (idAsociado: number) => getDocsLinkByAsociado(idAsociado) });

export const useDocsLinkBySolicitud = () =>
  useMutation({ mutationFn: (idSolicitud: number) => getDocsLinkBySolicitud(idSolicitud) });