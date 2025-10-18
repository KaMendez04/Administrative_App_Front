import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { rejectVolunteerSolicitud } from "../../../services/Volunteers/volunteerService";

export function useRejectVolunteerSolicitud() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) =>
      rejectVolunteerSolicitud(id, motivo),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["volunteer-solicitudes"] });

      // ✅ Actualizar el detalle en caché
      qc.setQueryData(["volunteer-solicitud-detail", vars.id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          estado: "RECHAZADO",
          fechaResolucion: new Date().toISOString(),
          motivo: vars.motivo,
        };
      });

      toast.success("Solicitud de voluntariado rechazada correctamente");
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Error al rechazar la solicitud de voluntariado"
      );
    },
  });
}