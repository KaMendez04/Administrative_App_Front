import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../services/apiConfig";
import type { FincaOtroEquipo } from "../../types/finca";

export function useFincaOtrosEquipos(idFinca: number | null) {
  return useQuery<FincaOtroEquipo[]>({
    queryKey: ["otros-equipos-by-finca", idFinca],
    queryFn: async (): Promise<FincaOtroEquipo[]> => {
      const response = await apiConfig.get<FincaOtroEquipo[]>(`/finca-otro-equipo/finca/${idFinca}`);
      return response.data || [];
    },
    enabled: !!idFinca,
    staleTime: 300_000,
  });
}