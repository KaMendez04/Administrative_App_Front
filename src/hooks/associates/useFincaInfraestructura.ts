import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../services/apiConfig";
import type { InfraestructuraProduccion } from "../../types/finca";

export function useFincaInfraestructura(idFinca: number | null) {
  return useQuery<InfraestructuraProduccion | null>({
    queryKey: ["infraestructura-by-finca", idFinca],
    queryFn: async (): Promise<InfraestructuraProduccion | null> => {
      const response = await apiConfig.get<InfraestructuraProduccion | null>(`/infraestructura-produccion/finca/${idFinca}`);
      return response.data;
    },
    enabled: !!idFinca,
    staleTime: 300_000,
  });
}