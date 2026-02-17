import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../apiConfig/apiConfig";
import type { CorrienteElectrica } from "../../types/finca";

export function useFincaCorriente(idFinca: number | null) {
  return useQuery<CorrienteElectrica | null>({
    queryKey: ["corriente-by-finca", idFinca],
    queryFn: async () => {
      // ✅ La corriente viene DIRECTAMENTE en la finca
      // Este hook es para consistencia, pero los datos ya vienen en findOneBasic
      const response = await apiConfig.get(`/fincas/${idFinca}`);
      return response.data || null;
    },
    enabled: !!idFinca,
    staleTime: 300_000,
  });
}