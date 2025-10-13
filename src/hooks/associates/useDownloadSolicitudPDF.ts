// hooks/associates/useDownloadSolicitudPDF.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateSolicitudPDF } from "../../services/Associates/pdfGenerator";
import { loadCompleteFincaData } from "../../utils/loadCompleteFincaData";

type DownloadPDFParams = {
  solicitud: any;
  associate?: any;
  fincas?: any[];
};

export function useDownloadSolicitudPDF() {
  return useMutation({
    mutationFn: async ({ solicitud, associate, fincas }: DownloadPDFParams) => {
      const fincasBasicas = fincas || solicitud.asociado?.fincas || [];
      
      // 🔸 Cargar info completa de cada finca
      const fincasCompletas = await Promise.all(
        fincasBasicas.map(async (finca: any) => {
          const dataCompleta = await loadCompleteFincaData(finca.idFinca);
          return {
            ...finca,
            ...dataCompleta,
          };
        })
      );

      // Generar PDF con data completa
      const doc = generateSolicitudPDF(
        solicitud,
        associate || solicitud.asociado,
        fincasCompletas
      );

      // Descargar
      doc.save(`solicitud-${solicitud.idSolicitud}.pdf`);
    },
    onSuccess: () => {
      toast.success("PDF descargado exitosamente");
    },
    onError: (error: any) => {
      console.error('Error generando PDF:', error);
      const message = error.message || "Error al generar PDF";
      toast.error("Error", {
        description: message,
      });
    },
  });
}