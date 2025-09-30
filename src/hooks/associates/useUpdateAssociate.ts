import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssociate } from "../../services/adminAssociatesService";
import type { UpdateAssociateValues } from "../../schemas/adminAssociates";

export function useUpdateAssociate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: UpdateAssociateValues }) => updateAssociate(id, patch),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-associates"] });
      qc.invalidateQueries({ queryKey: ["admin-associate", vars.id] });
    },
  });
}
