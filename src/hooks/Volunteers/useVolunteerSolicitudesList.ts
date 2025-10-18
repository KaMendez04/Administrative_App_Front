import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listVolunteerSolicitudes } from "../../services/Volunteers/volunteerService";
import type { VolunteerListParams } from "../../schemas/volunteerSchemas";

export function useVolunteerSolicitudesList(params: VolunteerListParams) {
  
  return useQuery({
    queryKey: ["volunteer-solicitudes", params],
    queryFn: () => {
      return listVolunteerSolicitudes(params);
    },
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}