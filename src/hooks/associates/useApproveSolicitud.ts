import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveSolicitud } from "../../services/Associates/adminSolicitudesService";

export function useApproveSolicitud() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => approveSolicitud(id),
    onSuccess: (_data, id) => {
      // ✅ Invalidar listas
      qc.invalidateQueries({ queryKey: ["solicitudes"] });
      qc.invalidateQueries({ queryKey: ["associates"] });
      
      // ✅ Actualizar el detalle en caché sin recargar
      qc.setQueryData(["solicitud", id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          estado: "APROBADO",
          fechaResolucion: new Date(),
        };
      });
      
      toast.success("Solicitud aprobada correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al aprobar la solicitud");
    },
  });
}