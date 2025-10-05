import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectSolicitud } from "../../services/adminSolicitudesService";
import { toast } from "sonner";

export function useRejectSolicitud() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) => rejectSolicitud(id, motivo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["solicitudes"] });
      toast.success("Solicitud rechazada correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al rechazar la solicitud");
    },
  });
}