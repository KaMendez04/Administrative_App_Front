import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../services/apiConfig";
import type { CanalComercializacion } from "../../types/finca";

export function useFincaCanales(idFinca: number | null) {
  return useQuery<CanalComercializacion[]>({
    queryKey: ["canales-by-finca", idFinca],
    queryFn: async (): Promise<CanalComercializacion[]> => {
      const response = await apiConfig.get<CanalComercializacion[]>(`/canales-comercializacion/by-finca/${idFinca}`);
      return response.data || [];
    },
    enabled: !!idFinca,
    staleTime: 300_000,
    gcTime: 600_000,
    refetchOnWindowFocus: false,
  });
}