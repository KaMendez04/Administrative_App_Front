import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveSolicitud } from "../../services/adminSolicitudesService";
import { toast } from "sonner";

export function useApproveSolicitud() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approveSolicitud(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["solicitudes"] });
      qc.invalidateQueries({ queryKey: ["associates"] });
      toast.success("Solicitud aprobada correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al aprobar la solicitud");
    },
  });
}