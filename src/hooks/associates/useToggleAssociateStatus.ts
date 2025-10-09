import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleAssociateStatus } from "../../services/adminAssociatesService";
import { toast } from "sonner";

export function useToggleAssociateStatus() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => toggleAssociateStatus(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["associates"] });
      qc.invalidateQueries({ queryKey: ["associate", id] });
      toast.success("Estado actualizado correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al cambiar el estado");
    },
  });
}