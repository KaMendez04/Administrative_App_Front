import { useMutation } from "@tanstack/react-query";
import { downloadSolicitudesPDF } from "../../services/Associates/adminSolicitudesService";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

function getDateStr() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function useDownloadSolicitudesPDF() {
  return useMutation({
    mutationFn: async (params: {
      estado?: "PENDIENTE" | "APROBADO" | "RECHAZADO";
      search?: string;
      sort?: string;
    }) => {
      return await downloadSolicitudesPDF(params);
    },
    onSuccess: (blob, vars) => {
      const estado = vars.estado ?? "TODOS";
      downloadBlob(blob, `solicitudes_${estado}_${getDateStr()}.pdf`);
    },
  });
}