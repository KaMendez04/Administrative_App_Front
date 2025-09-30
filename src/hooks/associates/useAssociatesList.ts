import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { listAssociates } from "../../services/adminAssociatesService";
import type { AdminListParams } from "../../schemas/adminAssociates";

export function useAdminAssociatesList({ page, limit, status, search, sort }: AdminListParams) {
  return useQuery({
    queryKey: ['associates', { page, limit, status, search, sort }],
    queryFn: () => listAssociates({ page, limit, status, search, sort }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
