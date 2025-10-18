import { useQuery } from "@tanstack/react-query"
import { listAssociates } from "../../services/adminAssociatesService"
import { listPersonalPages } from "../../services/personalPageService"


/**
 * Hook para asociados - USA SERVICIO REAL
 */
export function useAssociatesCount() {
  return useQuery({
    queryKey: ["dashboard", "associatesCount"],
    queryFn: async () => {
      try {
        const response = await listAssociates({ page: 1, limit: 1, estado: true })
        
        // Ajusta según la estructura de tu respuesta de asociados
        // Si retorna { total: number }, úsalo primero (paginado)
        if (typeof response?.total === 'number') {
          return response.total
        }
        
        // Si retorna { items: [...] } (paginado)
        if (response?.items && Array.isArray(response.items)) {
          return response.items.length
        }
        
        // Si retorna directamente un array
        if (Array.isArray(response)) {
          return response.filter((a: any) => a.isActive !== false).length
        }
        
        // Si retorna { data: [...] }
        if ((response as any)?.data && Array.isArray((response as any).data)) {
          return (response as any).data.filter((a: any) => a.isActive !== false).length
        }
        
        return 0
      } catch (error) {
        console.error("Error fetching associates count:", error)
        return 0
      }
    },
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    placeholderData: 0,
  })
}

/**
 * Hook para personal - USA SERVICIO REAL si existe
 * Si no existe, comenta este hook y usa el valor estático abajo
 */
export function usePersonalCount() {
  return useQuery({
    queryKey: ["dashboard", "personalCount"],
    queryFn: async () => {
      try {
        const response = await listPersonalPages()
        return Array.isArray(response)
          ? response.filter((p: any) => p.isActive !== false).length
          : 0
      } catch (error) {
        console.error("Error fetching personal count:", error)
        return 0
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: 0,
  })
}

/**
 * Hook combinado - Mezcla servicios reales con valores estáticos
 */
export function useModuleCounts() {
  // Asociados: servicio real
  const associatesQ = useAssociatesCount()
  
  // Personal: servicio real (si existe, sino comenta y usa valor estático)
  const personalQ = usePersonalCount()
  
  return {
    personal: {
      count: personalQ.data ?? 0,
      isLoading: personalQ.isLoading,
      error: personalQ.error,
    },
    associates: {
      count: associatesQ.data ?? 0,
      isLoading: associatesQ.isLoading,
      error: associatesQ.error,
    },
    // Voluntarios: valor estático (en desarrollo)
    volunteers: {
      count: 15, // ← Valor quemado, cámbialo cuando quieras
      isLoading: false,
      error: null,
    },
  }
}