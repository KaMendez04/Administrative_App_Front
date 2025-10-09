import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../services/apiConfig";
import type { ActividadAgropecuaria } from "../../types/finca";

export function useFincaActividades(idFinca: number | null) {
  return useQuery<ActividadAgropecuaria[]>({
    queryKey: ["actividades-by-finca", idFinca],
    queryFn: async (): Promise<ActividadAgropecuaria[]> => {
      const response = await apiConfig.get<ActividadAgropecuaria[]>(`/actividades-agropecuarias/by-finca/${idFinca}`);
      return response.data || [];
    },
    enabled: !!idFinca,
    staleTime: 300_000,
  });
}