import { useQuery } from "@tanstack/react-query";
import { listAreasInteres } from "../../services/Volunteers/volunteerCatalogsService";

export function useAreasInteres() {
  return useQuery({
    queryKey: ["areas-interes"],
    queryFn: () => listAreasInteres(),
    staleTime: 600_000, // 10 minutos (son catálogos, cambian poco)
    gcTime: 1200_000, // 20 minutos
  });
}