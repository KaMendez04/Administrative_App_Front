import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { rejectSolicitud } from "../../services/Associates/adminSolicitudesService";

export function useRejectSolicitud() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) => 
      rejectSolicitud(id, motivo),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["solicitudes"] });
      
      // ✅ Actualizar el detalle en caché
      qc.setQueryData(["solicitud", vars.id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          estado: "RECHAZADO",
          fechaResolucion: new Date(),
          motivo: vars.motivo,
        };
      });
      
      toast.success("Solicitud rechazada correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al rechazar la solicitud");
    },
  });
}