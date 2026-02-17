import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../apiConfig/apiConfig";
import type { MetodoRiego } from "../../types/finca";

export function useFincaMetodosRiego(idFinca: number | null) {
  return useQuery<MetodoRiego[]>({
    queryKey: ["metodos-riego-by-finca", idFinca],
    queryFn: async (): Promise<MetodoRiego[]> => {
      const response = await apiConfig.get<MetodoRiego[]>(`/metodos-riego/finca/${idFinca}`);
      return response.data || [];
    },
    enabled: !!idFinca,
    staleTime: 300_000,
  });
}