import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveAssociate } from "../../services/adminAssociatesService";
import { toast } from "sonner";

export function useApproveAssociate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approveAssociate(id),
    onSuccess: (_data, id) => {
      // ✅ Invalida todas las listas de associates (sin importar los filtros)
      qc.invalidateQueries({ queryKey: ["associates"] });
      // ✅ Invalida el detalle específico
      qc.invalidateQueries({ queryKey: ["admin-associate", id] });
      toast.success("Asociado aprobado correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al aprobar el asociado");
    },
  });
}