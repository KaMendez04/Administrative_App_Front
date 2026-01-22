import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleAssociateStatus } from "../../services/Associates/adminAssociatesService";

export function useToggleAssociateStatus() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => toggleAssociateStatus(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["associates"] });
      qc.invalidateQueries({ queryKey: ["associate-detail", data.idAsociado] });
      
      const mensaje = data.estado 
        ? "Asociado activado correctamente" 
        : "Asociado desactivado correctamente";
      
      toast.success(mensaje);
    },
    onError: (error: any) => {
      const mensaje = error?.response?.data?.message || error?.message || "Error al cambiar el estado del asociado";
      toast.error(mensaje);
    },
  });
}