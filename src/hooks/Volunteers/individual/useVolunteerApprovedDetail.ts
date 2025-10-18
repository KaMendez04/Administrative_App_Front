import { useQuery } from "@tanstack/react-query";
import { getVolunteerApproved } from "../../../services/Volunteers/volunteerApprovedService";

export function useVolunteerApprovedDetail(id: number) {
  return useQuery({
    queryKey: ["volunteer-approved", id],
    queryFn: () => getVolunteerApproved(id),
    enabled: id > 0,
  });
}