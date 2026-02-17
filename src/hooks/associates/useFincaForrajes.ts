import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../apiConfig/apiConfig";
import type { Forraje } from "../../types/finca";

export function useFincaForrajes(idFinca: number | null) {
  return useQuery<Forraje[]>({
    queryKey: ["forrajes-by-finca", idFinca],
    queryFn: async (): Promise<Forraje[]> => {
      const response = await apiConfig.get<Forraje[]>(`/forraje/finca/${idFinca}`);
      return response.data || [];
    },
    enabled: !!idFinca,
    staleTime: 300_000,
  });
}