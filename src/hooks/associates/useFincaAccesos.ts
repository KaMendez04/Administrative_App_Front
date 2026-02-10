import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../apiConfig/apiConfig";
import type { Acceso } from "../../types/finca";

export function useFincaAccesos(idFinca: number | null) {
  return useQuery<Acceso[]>({
    queryKey: ["accesos-by-finca", idFinca],
    queryFn: async (): Promise<Acceso[]> => {
      const response = await apiConfig.get<Acceso[]>(`/accesos/finca/${idFinca}`);
      return response.data || [];
    },
    enabled: !!idFinca,
    staleTime: 300_000,
  });
}