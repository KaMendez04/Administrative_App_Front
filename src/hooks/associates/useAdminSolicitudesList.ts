import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listAssociates } from "../../services/adminAssociatesService";
import type { AdminListParams, AssociateListParams } from "../../schemas/adminSolicitudes";
import { listSolicitudes } from "../../services/adminSolicitudesService";

export function useAdminSolicitudesList(params: AdminListParams) {
  return useQuery({
    queryKey: ['solicitudes', params],
    queryFn: () => listSolicitudes(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useAdminAssociatesList(params: AssociateListParams) { // Cambiar tipo
  return useQuery({
    queryKey: ['associates', params],
    queryFn: () => listAssociates(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}