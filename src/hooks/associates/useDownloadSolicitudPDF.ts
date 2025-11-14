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

      // ✅ Construir nombre del archivo con nombre y cédula del asociado
      const persona = solicitud.persona;
      const nombreCompleto = `${persona.nombre}_${persona.apellido1}_${persona.apellido2}`;
      const cedula = persona.cedula;
      
      // Sanitizar el nombre (remover caracteres especiales y espacios)
      const nombreSanitizado = nombreCompleto
        .normalize("NFD")                           // Descomponer caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "")           // Remover acentos
        .replace(/[^a-zA-Z0-9_]/g, "_")            // Reemplazar caracteres especiales con _
        .replace(/_+/g, "_")                       // Evitar múltiples guiones bajos consecutivos
        .toLowerCase();
      
      const nombreArchivo = `Solicitud_${nombreSanitizado}_${cedula}.pdf`;

      // Descargar
      doc.save(nombreArchivo);
      
      return nombreArchivo; // Retornar para uso en onSuccess si es necesario
    },
    onSuccess: (nombreArchivo) => {
      toast.success("PDF descargado exitosamente", {
        description: `Archivo: ${nombreArchivo}`
      });
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