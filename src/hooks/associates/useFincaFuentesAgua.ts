import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../apiConfig/apiConfig";
import type { FuenteAgua } from "../../types/finca";

export function useFincaFuentesAgua(idFinca: number | null) {
  return useQuery<FuenteAgua[]>({
    queryKey: ["fuentes-agua-by-finca", idFinca],
    queryFn: async (): Promise<FuenteAgua[]> => {
      const response = await apiConfig.get<FuenteAgua[]>(`/fuentes-agua/by-finca/${idFinca}`);
      return response.data || [];
    },
    enabled: !!idFinca,
    staleTime: 300_000,
  });
}