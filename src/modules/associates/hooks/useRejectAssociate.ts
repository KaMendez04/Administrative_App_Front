import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectAssociate } from "../services/adminAssociatesService";
import { toast } from "sonner";

export function useRejectAssociate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) => rejectAssociate(id, motivo),
    onSuccess: (_data, vars) => {
      // ✅ Invalida todas las listas de associates
      qc.invalidateQueries({ queryKey: ["associates"] });
      // ✅ Invalida el detalle específico
      qc.invalidateQueries({ queryKey: ["admin-associate", vars.id] });
      toast.success("Asociado rechazado correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al rechazar el asociado");
    },
  });
}