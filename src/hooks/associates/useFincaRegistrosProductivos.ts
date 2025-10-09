import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../services/apiConfig";
import type { RegistrosProductivos } from "../../types/finca";

export function useFincaRegistrosProductivos(idFinca: number | null) {
  return useQuery<RegistrosProductivos | null>({
    queryKey: ["registros-productivos-by-finca", idFinca],
    queryFn: async (): Promise<RegistrosProductivos | null> => {
      const response = await apiConfig.get<RegistrosProductivos | null>(`/registros-productivos/finca/${idFinca}`);
      return response.data;
    },
    enabled: !!idFinca,
    staleTime: 300_000,
  });
}