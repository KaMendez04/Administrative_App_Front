import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssociate } from "../../services/adminAssociatesService";
import type { UpdateAssociateValues } from "../../schemas/adminAssociates";
import { toast } from "sonner";

export function useUpdateAssociate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: UpdateAssociateValues }) => updateAssociate(id, patch),
    onSuccess: (_data, vars) => {
      // ✅ Invalida todas las listas de associates
      qc.invalidateQueries({ queryKey: ["associates"] });
      // ✅ Invalida el detalle específico
      qc.invalidateQueries({ queryKey: ["admin-associate", vars.id] });
      toast.success("Asociado actualizado correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al actualizar el asociado");
    },
  });
}