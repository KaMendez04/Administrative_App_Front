import { useQuery } from "@tanstack/react-query";
import { getVolunteerSolicitud } from "../../../services/Volunteers/volunteerService";

export function useVolunteerSolicitudDetail(id: number | null) {
  return useQuery({
    queryKey: ["volunteer-solicitud-detail", id],
    queryFn: async () => {
      if (!id) throw new Error("ID es requerido");
      return getVolunteerSolicitud(id);
    },
    enabled: typeof id === "number" && id > 0,
    staleTime: 300_000, // 5 minutos
    retry: 1,
  });
}