import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listAssociates } from "../../services/Associates/adminAssociatesService";
import type { AssociateListParams } from "../../schemas/adminSolicitudes";

export function useAdminAssociatesList(params: AssociateListParams) {
  return useQuery({
    queryKey: ['associates', params],
    queryFn: () => listAssociates(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000, // 1 minuto
  });
}