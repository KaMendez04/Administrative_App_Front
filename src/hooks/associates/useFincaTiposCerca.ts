import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../apiConfig/apiConfig";
import type { FincaTipoCerca } from "../../types/finca";

export function useFincaTiposCerca(idFinca: number | null) {
  return useQuery<FincaTipoCerca[]>({
    queryKey: ["tipos-cerca-by-finca", idFinca],
    queryFn: async (): Promise<FincaTipoCerca[]> => {
      if (!idFinca) {
        console.warn('⚠️ idFinca es null, no se puede buscar tipos de cerca');
        return [];
      }

      try {
        console.log('🔍 Buscando tipos de cerca para finca:', idFinca);
        const response = await apiConfig.get<FincaTipoCerca[]>(`/finca-tipo-cerca/by-finca/${idFinca}`);
        console.log('✅ Tipos de cerca encontrados:', response.data);
        return response.data || [];
      } catch (error: any) {
        console.error('❌ Error al buscar tipos de cerca:', error);
        
        // Si es un 404, retornar array vacío (no hay tipos de cerca)
        if (error?.response?.status === 404) {
          console.log('📝 No hay tipos de cerca para esta finca');
          return [];
        }
        
        // Para otros errores, lanzar la excepción
        throw error;
      }
    },
    enabled: !!idFinca,
    staleTime: 300_000,
    retry: 1, // Solo reintentar una vez
    retryDelay: 1000, // Esperar 1 segundo antes de reintentar
  });
}