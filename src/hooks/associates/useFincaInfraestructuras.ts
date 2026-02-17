import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../apiConfig/apiConfig";
import type { FincaInfraestructura } from "../../types/finca";

export function useFincaInfraestructuras(idFinca: number | null) {
  return useQuery<FincaInfraestructura[]>({
    queryKey: ["finca-infraestructuras-by-finca", idFinca],
    queryFn: async (): Promise<FincaInfraestructura[]> => {
      const response = await apiConfig.get<FincaInfraestructura[]>(`/finca-infraestructuras/by-finca/${idFinca}`);
      return response.data || [];
    },
    enabled: !!idFinca,
    staleTime: 300_000,
  });
}