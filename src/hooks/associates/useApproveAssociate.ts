import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveAssociate } from "../../services/adminAssociatesService";

export function useApproveAssociate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approveAssociate(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["admin-associates"] });
      qc.invalidateQueries({ queryKey: ["admin-associate", id] });
    },
  });
}
