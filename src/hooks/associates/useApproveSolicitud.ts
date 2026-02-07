import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveSolicitud } from "../../services/Associates/adminSolicitudesService";

export function useApproveSolicitud() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo?: string }) =>
      approveSolicitud(id, motivo),

    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["solicitudes"] });
      qc.invalidateQueries({ queryKey: ["associates"] });

      qc.setQueryData(["solicitud", vars.id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          estado: "APROBADO",
          fechaResolucion: new Date(),
          ...(vars.motivo !== undefined ? { motivo: vars.motivo } : {}),
        };
      });

      toast.success("Solicitud aprobada correctamente");
    },

    onError: (error: any) => {
      toast.error(error?.message || "Error al aprobar la solicitud");
    },
  });
}
