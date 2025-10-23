// hooks/Volunteers/useToggleVolunteerStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleVolunteerStatus } from "../../../services/Volunteers/volunteerApprovedService";

interface ToggleVolunteerStatusResponse {
  idVoluntario: number;
  isActive: boolean;
}

export function useToggleVolunteerStatus() {
  const qc = useQueryClient();
  
  return useMutation<ToggleVolunteerStatusResponse, Error, number>({
    mutationFn: (id: number) => toggleVolunteerStatus(id) as Promise<ToggleVolunteerStatusResponse>,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["volunteers-approved"] });
      qc.invalidateQueries({ queryKey: ["volunteer-detail", data.idVoluntario] });
      
      const mensaje = data.isActive
        ? "Voluntario activado correctamente"
        : "Voluntario desactivado correctamente";
      
      toast.success(mensaje);
    },
    onError: (error: any) => {
      const mensaje = error?.response?.data?.message || error?.message || "Error al cambiar el estado del voluntario";
      toast.error(mensaje);
    },
  });
}