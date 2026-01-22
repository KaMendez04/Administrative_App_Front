import { useQuery } from "@tanstack/react-query";
import { getSolicitudComplete } from "../../services/Associates/adminSolicitudesService";

export function useAdminSolicitudDetail(id: number) {
  return useQuery({
    queryKey: ["solicitud-complete", id],
    queryFn: () => getSolicitudComplete(id), // ✅ Usar complete
    enabled: id > 0,
    staleTime: 60_000,
    retry: 1,
  });
}