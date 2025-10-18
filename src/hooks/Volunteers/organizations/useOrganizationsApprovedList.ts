import { useQuery } from "@tanstack/react-query";
import type { OrganizacionApprovedListParams } from "../../../schemas/volunteerSchemas";
import { listOrganizationsApproved } from "../../../services/Volunteers/organizationApprovedService";
export function useOrganizationsApprovedList(params: OrganizacionApprovedListParams) {
  return useQuery({
    queryKey: ["organizations-approved", params],
    queryFn: () => listOrganizationsApproved(params),
  });
}