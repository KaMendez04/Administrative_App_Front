import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../services/apiConfig";
import type { FincaTipoCerca } from "../../types/finca";

export function useFincaTiposCerca(idFinca: number | null) {
  return useQuery<FincaTipoCerca[]>({
    queryKey: ["tipos-cerca-by-finca", idFinca],
    queryFn: async (): Promise<FincaTipoCerca[]> => {
      const response = await apiConfig.get<FincaTipoCerca[]>(`/finca-tipo-cerca/by-finca/${idFinca}`);
      return response.data || [];
    },
    enabled: !!idFinca,
    staleTime: 300_000,
  });
}