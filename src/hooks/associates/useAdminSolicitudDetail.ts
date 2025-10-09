import { useQuery } from "@tanstack/react-query";
import { getSolicitudComplete } from "../../services/adminSolicitudesService"; // ✅ Cambiar

export function useAdminSolicitudDetail(id: number) {
  return useQuery({
    queryKey: ["solicitud-complete", id], // ✅ Cambiar key
    queryFn: () => getSolicitudComplete(id), // ✅ Usar complete
    enabled: id > 0,
    staleTime: 60_000,
    retry: 1,
  });
}