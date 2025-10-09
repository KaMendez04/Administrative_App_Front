import { useQuery } from "@tanstack/react-query";
import { getSolicitud } from "../../services/adminSolicitudesService";

// ✅ Para cargar TODO el detalle (modal con todas las fincas completas)
export function useAdminSolicitudDetail(id: number) {
  return useQuery({
    queryKey: ["solicitud", id],
    queryFn: () => getSolicitud(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}