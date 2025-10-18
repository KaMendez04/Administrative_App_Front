import { useQuery } from "@tanstack/react-query";
import { getOrganizationApproved } from "../../../services/Volunteers/organizationApprovedService";
export function useOrganizationDetail(id: number | null) {
  return useQuery({
    queryKey: ["organization-detail", id],
    queryFn: () => (id ? getOrganizationApproved(id) : null),
    enabled: id !== null,
  });
}