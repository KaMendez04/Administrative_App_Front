import { useQuery } from "@tanstack/react-query"
import { listAssociates } from "../../services/adminAssociatesService"
import { listPersonalPages } from "../../services/personalPageService"
import { listVolunteersApproved } from "../../services/Volunteers/volunteerApprovedService"

// ✅ Configuración centralizada de refresh
const REFRESH_CONFIG = {
  refetchInterval: 30000, // 30 segundos
  refetchIntervalInBackground: false,
  staleTime: 20000, // 20 segundos
  retry: 1,
}

/**
 * Hook para asociados - CON AUTO-REFRESH
 */
export function useAssociatesCount() {
  return useQuery({
    queryKey: ["dashboard", "associatesCount"],
    queryFn: async () => {
      try {
        const response = await listAssociates({ page: 1, limit: 1, estado: true })
        
        if (typeof response?.total === 'number') {
          return response.total
        }
        
        if (response?.items && Array.isArray(response.items)) {
          return response.items.length
        }
        
        if (Array.isArray(response)) {
          return response.filter((a: any) => a.isActive !== false).length
        }
        
        if ((response as any)?.data && Array.isArray((response as any).data)) {
          return (response as any).data.filter((a: any) => a.isActive !== false).length
        }
        
        return 0
      } catch (error) {
        console.error("Error fetching associates count:", error)
        return 0
      }
    },
    ...REFRESH_CONFIG,
    placeholderData: 0,
  })
}

/**
 * Hook para personal - CON AUTO-REFRESH
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
    ...REFRESH_CONFIG,
    placeholderData: 0,
  })
}

/**
 * Hook para voluntarios aprobados - CON AUTO-REFRESH
 */
export function useVolunteersCount() {
  return useQuery({
    queryKey: ["dashboard", "volunteersCount"],
    queryFn: async () => {
      try {
        const response = await listVolunteersApproved({
          page: 1,
          limit: 1,
          isActive: true,
        })
        
        if (typeof response?.total === 'number') {
          return response.total
        }
        
        if (response?.items && Array.isArray(response.items)) {
          return response.items.length
        }
        
        if (Array.isArray(response)) {
          return response.filter((v: any) => v.isActive !== false).length
        }
        
        if ((response as any)?.data && Array.isArray((response as any).data)) {
          return (response as any).data.filter((v: any) => v.isActive !== false).length
        }
        
        return 0
      } catch (error) {
        console.error("Error fetching volunteers count:", error)
        return 0
      }
    },
    ...REFRESH_CONFIG,
    placeholderData: 0,
  })
}

/**
 * Hook combinado - Todos los contadores con auto-refresh
 */
export function useModuleCounts() {
  const personalQ = usePersonalCount()
  const associatesQ = useAssociatesCount()
  const volunteersQ = useVolunteersCount()
  
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
    volunteers: {
      count: volunteersQ.data ?? 0,
      isLoading: volunteersQ.isLoading,
      error: volunteersQ.error,
    },
  }
}