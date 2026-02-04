import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveVolunteerSolicitud } from "../../../services/Volunteers/volunteerService";

export function useApproveVolunteerSolicitud() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo?: string }) =>
      approveVolunteerSolicitud(id, motivo),

    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["volunteer-solicitudes"] });

      qc.setQueryData(["volunteer-solicitud-detail", vars.id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          estado: "APROBADO",
          fechaResolucion: new Date().toISOString(),
          ...(vars.motivo !== undefined ? { motivo: vars.motivo } : {}),
        };
      });

      toast.success("Solicitud de voluntariado aprobada correctamente");
    },
  });
}
