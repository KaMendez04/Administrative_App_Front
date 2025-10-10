import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../services/apiConfig";
import type { Necesidad } from "../../types/finca";

export function useAssociateNecesidades(idAsociado: number | null) {
  return useQuery<Necesidad[]>({
    queryKey: ["necesidades-by-asociado", idAsociado],
    queryFn: async (): Promise<Necesidad[]> => {
      const response = await apiConfig.get<Necesidad[]>(`/necesidades/asociado/${idAsociado}`);
      return response.data || [];
    },
    enabled: !!idAsociado,
    staleTime: 300_000,
    gcTime: 600_000,
    refetchOnWindowFocus: false,
  });
}