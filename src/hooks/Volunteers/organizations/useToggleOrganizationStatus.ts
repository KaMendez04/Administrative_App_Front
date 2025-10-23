// hooks/Volunteers/useToggleOrganizacionStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleOrganizacionStatus } from "../../../services/Volunteers/organizationApprovedService";

interface ToggleOrganizacionStatusResponse {
  idOrganizacion: number;
  isActive: boolean;
}

export function useToggleOrganizacionStatus() {
  const qc = useQueryClient();
  
  return useMutation<ToggleOrganizacionStatusResponse, Error, number>({
    mutationFn: (id: number) => toggleOrganizacionStatus(id) as Promise<ToggleOrganizacionStatusResponse>,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["organizaciones-approved"] });
      qc.invalidateQueries({ queryKey: ["organizacion-detail", data.idOrganizacion] });
      
      const mensaje = data.isActive
        ? "Organización activada correctamente"
        : "Organización desactivada correctamente";
      
      toast.success(mensaje);
    },
    onError: (error: any) => {
      const mensaje = error?.response?.data?.message || error?.message || "Error al cambiar el estado de la organización";
      toast.error(mensaje);
    },
  });
}