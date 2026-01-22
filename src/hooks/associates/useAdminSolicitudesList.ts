import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listSolicitudes } from "../../services/Associates/adminSolicitudesService";
import type { AdminListParams } from "../../schemas/adminSolicitudes";

export function useAdminSolicitudesList(params: AdminListParams) {
  return useQuery({
    queryKey: ['solicitudes', params],
    queryFn: () => listSolicitudes(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}