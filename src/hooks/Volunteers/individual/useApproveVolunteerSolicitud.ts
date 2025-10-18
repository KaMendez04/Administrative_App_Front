import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveVolunteerSolicitud } from "../../../services/Volunteers/volunteerService";

export function useApproveVolunteerSolicitud() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => approveVolunteerSolicitud(id),
    onSuccess: (_data, id) => {
      // Invalidar listas
      qc.invalidateQueries({ queryKey: ["volunteer-solicitudes"] });

      // Actualizar el detalle en caché sin recargar
      qc.setQueryData(["volunteer-solicitud-detail", id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          estado: "APROBADO",
          fechaResolucion: new Date().toISOString(),
        };
      });

      toast.success("Solicitud de voluntariado aprobada correctamente");
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Error al aprobar la solicitud de voluntariado"
      );
    },
  });
}