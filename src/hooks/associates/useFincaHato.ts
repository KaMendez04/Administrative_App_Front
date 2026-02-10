import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../apiConfig/apiConfig";
import type { Hato } from "../../types/finca";

export function useFincaHato(idFinca: number | null) {
  return useQuery<Hato | null>({
    queryKey: ["hato-by-finca", idFinca],
    queryFn: async (): Promise<Hato | null> => {
      const response = await apiConfig.get<Hato | null>(`/hatos/finca/${idFinca}`);
      return response.data;
    },
    enabled: !!idFinca,
    staleTime: 300_000,
  });
}