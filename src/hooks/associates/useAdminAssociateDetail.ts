import { useQuery } from "@tanstack/react-query";
import { getAssociateBasic } from "../../services/Associates/adminAssociatesService";

export function useAssociateDetail(id: number | null) {
  return useQuery({
    queryKey: ["associate-detail", id],
    queryFn: async () => {
      if (!id) throw new Error("ID es requerido");
      return getAssociateBasic(id);
    },
    enabled: !!id,
    staleTime: 300_000, // 5 minutos
  });
}