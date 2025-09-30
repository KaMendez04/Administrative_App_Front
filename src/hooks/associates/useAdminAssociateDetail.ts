import { useQuery } from "@tanstack/react-query";
import { getAssociate } from "../../services/adminAssociatesService";

export function useAdminAssociateDetail(id: number) {
  return useQuery({
    queryKey: ["admin-associate", id],
    queryFn: () => getAssociate(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}
