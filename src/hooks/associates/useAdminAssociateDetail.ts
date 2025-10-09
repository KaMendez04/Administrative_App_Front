import { useQuery } from "@tanstack/react-query";
import { getAssociate } from "../../services/adminAssociatesService";

// ✅ Para cargar TODO el detalle (modal/página completa)
export function useAdminAssociateDetail(id: number) {
  return useQuery({
    queryKey: ["associate", id],
    queryFn: () => getAssociate(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}