import { solicitudesVoluntariadoPdfService, voluntarioDetallePdfService, voluntariosPdfService } from "@/services/Volunteers/volunteerService";
import { useMutation } from "@tanstack/react-query";

export function useDownloadListadoVoluntariosPDF() {
  return useMutation({
    mutationFn: async () => {
      await voluntariosPdfService.downloadListadoVoluntariosPdf("listado-voluntarios.pdf");
    },
  });
}

export function useDownloadSolicitudesVoluntariadoPDF() {
  return useMutation({
    mutationFn: async () => {
      await solicitudesVoluntariadoPdfService.downloadSolicitudesPdf(
        "solicitudes-de-voluntarios.pdf"
      );
    },
  });
}

export function useDownloadVoluntarioDetallePDF() {
  return useMutation({
    mutationFn: async (idSolicitud: number) => {
      await voluntarioDetallePdfService.downloadDetallePdf(
        idSolicitud,
        `solicitud-${idSolicitud}.pdf`
      );
    },
  });
}