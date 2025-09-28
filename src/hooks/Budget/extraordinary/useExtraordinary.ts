// hooks/Budget/extraordinary/useExtraordinaryQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Extraordinary } from "../../../models/Budget/extraordinary/extraordinaryInterface";
import type { AssignExtraordinaryDto } from "../../../models/Budget/extraordinary/AssignInterface";


import {
  listExtraordinary,
  createExtraordinary,
  deleteExtraordinary,
  allocateExtraordinary,
  remainingExtraordinary,
  fetchDepartments,
  assignExtraordinary,
} from "../../../services/Budget/extraordinary/ExtraordinaryService";

// Query Keys
export const extraordinaryKeys = {
  all: ['extraordinaries'] as const,
  lists: () => [...extraordinaryKeys.all, 'list'] as const,
  list: (filters?: any) => [...extraordinaryKeys.lists(), filters] as const,
  departments: ['departments'] as const,
  remaining: (id: number) => [...extraordinaryKeys.all, 'remaining', id] as const,
};

// ===== QUERIES (para leer datos) =====

export function useExtraordinaryListQuery() {
  return useQuery({
    queryKey: extraordinaryKeys.list(),
    queryFn: listExtraordinary,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

export function useDepartmentsQuery() {
  return useQuery({
    queryKey: extraordinaryKeys.departments,
    queryFn: fetchDepartments,
    staleTime: 10 * 60 * 1000, // 10 minutos (los departamentos cambian menos)
  });
}

export function useRemainingQuery(id: number, enabled = false) {
  return useQuery({
    queryKey: extraordinaryKeys.remaining(id),
    queryFn: () => remainingExtraordinary(id),
    enabled: enabled && id > 0,
    staleTime: 30 * 1000, // 30 segundos
  });
}

// ===== MUTATIONS (para modificar datos) =====

export function useCreateExtraordinaryMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Pick<Extraordinary, "name" | "amount" | "date">) => 
      createExtraordinary(data),
    onSuccess: () => {
      // Invalidar la lista para que se recargue automáticamente
      queryClient.invalidateQueries({ queryKey: extraordinaryKeys.list() });
    },
  });
}

export function useDeleteExtraordinaryMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteExtraordinary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extraordinaryKeys.list() });
    },
  });
}

export function useAllocateExtraordinaryMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, amount }: { id: number; amount: number }) => 
      allocateExtraordinary(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extraordinaryKeys.list() });
      // También invalidar todos los remaining queries
      queryClient.invalidateQueries({ queryKey: extraordinaryKeys.all });
    },
  });
}

export function useAssignExtraordinaryMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto: AssignExtraordinaryDto) => assignExtraordinary(dto),
    onSuccess: () => {
      // Invalidar tanto extraordinarios como departamentos
      queryClient.invalidateQueries({ queryKey: extraordinaryKeys.list() });
      queryClient.invalidateQueries({ queryKey: extraordinaryKeys.departments });
    },
  });
}

// ===== HOOKS DE CONVENIENCIA (mantienen la misma API que tus hooks actuales) =====

// Para mantener compatibilidad con tu código existente
export function useExtraordinaryList() {
  const query = useExtraordinaryListQuery();
  
  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    reload: query.refetch,
  };
}

export function useDepartmentsE() {
  const query = useDepartmentsQuery();
  
  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    reload: query.refetch,
  };
}

export function useAssignExtraordinary() {
  const mutation = useAssignExtraordinaryMutation();
  
  return {
    submit: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    lastResult: mutation.data,
  };
}