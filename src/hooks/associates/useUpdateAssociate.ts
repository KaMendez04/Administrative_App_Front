import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssociate } from "../../services/adminAssociatesService";
import type { UpdateAssociateValues } from "../../schemas/adminSolicitudes";
import { toast } from "sonner";

export function useUpdateAssociate() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: UpdateAssociateValues }) => 
      updateAssociate(id, patch),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["associates"] });
      qc.invalidateQueries({ queryKey: ["associate", vars.id] });
      toast.success("Asociado actualizado correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al actualizar el asociado");
    },
  });
}