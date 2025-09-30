import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectAssociate } from "../../services/adminAssociatesService";

export function useRejectAssociate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) => rejectAssociate(id, motivo),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-associates"] });
      qc.invalidateQueries({ queryKey: ["admin-associate", vars.id] });
    },
  });
}
