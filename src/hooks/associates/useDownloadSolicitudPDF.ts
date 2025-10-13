import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiConfig from "../../services/apiConfig";

export function useDownloadSolicitudPDF() {
  return useMutation<Blob, unknown, number>({
    mutationFn: async (idSolicitud: number) => {
      const response = await apiConfig.get(`/solicitudes/${idSolicitud}/pdf`, {
        responseType: "blob",
      });
      return response.data as Blob;
    },
    onSuccess: (blob: Blob, idSolicitud: number) => {
      // Crear URL temporal del blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear link temporal y hacer click
      const link = document.createElement("a");
      link.href = url;
      link.download = `solicitud-${idSolicitud}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF descargado exitosamente");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al descargar PDF";
      toast.error("Error", {
        description: message,
      });
    },
  });
}