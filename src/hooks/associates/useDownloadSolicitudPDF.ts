import { useMutation } from "@tanstack/react-query"
import { getSolicitudPdfBlob } from "../../services/Associates/adminSolicitudesService"
import { downloadBlob } from "../../utils/pdf"


export function useDownloadSolicitudPDF() {
  return useMutation({
    mutationFn: async (id: number) => {
      const blob = await getSolicitudPdfBlob(id)
      return { blob, id }
    },
    onSuccess: ({ blob, id }) => {
      downloadBlob(blob, `solicitud_${id}.pdf`)
    },
  })
}

export const useOpenSolicitudPDF = useDownloadSolicitudPDF
