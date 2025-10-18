import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listVolunteersApproved } from "../../services/Volunteers/volunteerApprovedService";
import type { VolunteerApprovedListParams } from "../../schemas/volunteerSchemas";
export function useVolunteersApprovedList(params: VolunteerApprovedListParams) {
  return useQuery({
    queryKey: ["volunteers-approved", params],
    queryFn: () => listVolunteersApproved(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}