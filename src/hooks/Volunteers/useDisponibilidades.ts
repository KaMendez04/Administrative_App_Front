import { useQuery } from "@tanstack/react-query";
import { listDisponibilidades } from "../../services/Volunteers/volunteerCatalogsService";

export function useDisponibilidades() {
  return useQuery({
    queryKey: ["disponibilidades"],
    queryFn: () => listDisponibilidades(),
    staleTime: 600_000, // 10 minutos (son catálogos, cambian poco)
    gcTime: 1200_000, // 20 minutos
  });
}