import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleVolunteerStatus } from "../../../services/Volunteers/volunteerApprovedService";
import { toast } from "sonner";

export function useToggleVolunteerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleVolunteerStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers-approved"] });
      toast.success("Estado actualizado correctamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al cambiar estado");
    },
  });
}