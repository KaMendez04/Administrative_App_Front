import { useState } from "react"
import type { SolicitudVoluntariado } from "../../schemas/volunteerSchemas"
import { VolunteerIndividualInfo } from "./VolunteerIndividualInfo"
import { OrganizacionInfo } from "./OrganizacionInfo"
import { AreasInteresTab } from "./AreasInteresTab"
import { DisponibilidadTab } from "./DisponibilidadTab"
import { SolicitudStatusInfo } from "../SolicitudStatusInfo"
import { useDownloadVoluntarioDetallePDF } from "@/hooks/Volunteers/useVoluntariosPdf"
import { Download, FolderOpen } from "lucide-react"
import {
  useSolicitudHasDocs,
  useSolicitudVoluntariadoDocsLink,
} from "@/hooks/Volunteers/useVolunteerDocsLink"
import { toast } from "sonner"
import { useLockBodyScroll } from "@/hooks/modals/useLockBodyScroll"

interface VolunteerViewModalProps {
  open: boolean
  onClose: () => void
  solicitud: SolicitudVoluntariado | null
  isLoading: boolean
}

type Tab = "info" | "areas" | "disponibilidad"

export function VolunteerViewModal({
  open,
  onClose,
  solicitud,
  isLoading,
}: VolunteerViewModalProps) {
  const [selectedTab, setSelectedTab] = useState<Tab>("info")
  const openSolicitudPDF = useDownloadVoluntarioDetallePDF()
  const docsLinkMutation = useSolicitudVoluntariadoDocsLink()

  // Consulta silenciosa: ¿tiene documentos esta solicitud?
  // Solo se ejecuta cuando hay un id válido. Resultado cacheado 5 min.
  const idSolicitud = solicitud ? Number(solicitud.idSolicitudVoluntariado) : null
  const { data: hasDocs, isLoading: checkingDocs } = useSolicitudHasDocs(idSolicitud)

  const onOpenDocs = () => {
    if (!solicitud) return
    docsLinkMutation.mutate(Number(solicitud.idSolicitudVoluntariado), {
      onSuccess: (res: any) => {
        const url = res?.url ?? res?.link ?? res
        if (typeof url === "string" && url.length > 0) {
          window.open(url, "_blank", "noopener,noreferrer")
        } else {
          toast.error("No se pudo obtener el enlace de documentos")
        }
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "No se pudieron abrir los documentos"
        toast.error(Array.isArray(msg) ? msg.join(", ") : msg)
      },
    })
  }

  useLockBodyScroll(open);

  if (!open) return null

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(date)
  }

  if (isLoading || !solicitud) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B732E]" />
            <p className="mt-4 text-[#556B2F] font-medium">Cargando detalles...</p>
          </div>
        </div>
      </div>
    )
  }

  const hasAreasInteres =
    (solicitud.tipoSolicitante === "INDIVIDUAL" &&
      solicitud.voluntario?.areasInteres &&
      solicitud.voluntario.areasInteres.length > 0) ||
    (solicitud.tipoSolicitante === "ORGANIZACION" &&
      solicitud.organizacion?.areasInteres &&
      solicitud.organizacion.areasInteres.length > 0)

  const hasDisponibilidad =
    (solicitud.tipoSolicitante === "INDIVIDUAL" &&
      solicitud.voluntario?.disponibilidades &&
      solicitud.voluntario.disponibilidades.length > 0) ||
    (solicitud.tipoSolicitante === "ORGANIZACION" &&
      solicitud.organizacion?.disponibilidades &&
      solicitud.organizacion.disponibilidades.length > 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F8F9F3] to-[#EAEFE0] p-6 border-b border-[#EAEFE0] rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#33361D]">Detalles de la Solicitud de Voluntariado</h3>

              <div className="mt-4 flex flex-wrap gap-3 items-center">
                {/* Botón PDF — siempre visible */}
                <button
                  onClick={() => openSolicitudPDF.mutate(Number(solicitud.idSolicitudVoluntariado))}
                  disabled={openSolicitudPDF.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B732E] text-white font-semibold hover:bg-[#556B2F] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {openSolicitudPDF.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Descargar PDF
                    </>
                  )}
                </button>

                {/* Documentos: skeleton mientras verifica → botón si hay → texto si no hay */}
                {checkingDocs ? (
                  <div className="h-10 w-36 rounded-xl bg-gray-200 animate-pulse" />
                ) : hasDocs ? (
                  <button
                    onClick={onOpenDocs}
                    disabled={docsLinkMutation.isPending}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D5F4F] text-white font-semibold hover:opacity-90 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {docsLinkMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Abriendo...
                      </>
                    ) : (
                      <>
                        <FolderOpen className="w-4 h-4" />
                        Ver documentos
                      </>
                    )}
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 text-sm font-medium">
                    <FolderOpen className="w-4 h-4 opacity-50" />
                    No se adjuntaron documentos
                  </div>
                )}
              </div>
            </div>

            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#EAEFE0] px-6 bg-white">
          <button
            onClick={() => setSelectedTab("info")}
            className={`px-4 py-3 font-semibold text-sm transition ${
              selectedTab === "info"
                ? "text-[#5B732E] border-b-2 border-[#5B732E]"
                : "text-[#33361D] hover:text-[#5B732E]"
            }`}
          >
            Información General
          </button>

          {hasAreasInteres && (
            <button
              onClick={() => setSelectedTab("areas")}
              className={`px-4 py-3 font-semibold text-sm transition ${
                selectedTab === "areas"
                  ? "text-[#5B732E] border-b-2 border-[#5B732E]"
                  : "text-[#33361D] hover:text-[#5B732E]"
              }`}
            >
              Áreas de Interés
            </button>
          )}

          {hasDisponibilidad && (
            <button
              onClick={() => setSelectedTab("disponibilidad")}
              className={`px-4 py-3 font-semibold text-sm transition ${
                selectedTab === "disponibilidad"
                  ? "text-[#5B732E] border-b-2 border-[#5B732E]"
                  : "text-[#33361D] hover:text-[#5B732E]"
              }`}
            >
              Disponibilidad
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedTab === "info" && (
            <div className="space-y-6">
              {solicitud.tipoSolicitante === "INDIVIDUAL" && solicitud.voluntario && (
                <VolunteerIndividualInfo voluntario={solicitud.voluntario} formatDate={formatDate} />
              )}
              {solicitud.tipoSolicitante === "ORGANIZACION" && solicitud.organizacion && (
                <OrganizacionInfo organizacion={solicitud.organizacion} />
              )}
              <SolicitudStatusInfo
                estado={solicitud.estado}
                fechaSolicitud={solicitud.fechaSolicitud}
                fechaResolucion={solicitud.fechaResolucion}
                motivo={solicitud.motivo}
                formatDate={formatDate}
              />
            </div>
          )}

          {selectedTab === "areas" && (
            <AreasInteresTab
              areasInteres={
                solicitud.tipoSolicitante === "INDIVIDUAL"
                  ? solicitud.voluntario?.areasInteres || []
                  : solicitud.organizacion?.areasInteres || []
              }
              tipoSolicitante={solicitud.tipoSolicitante}
            />
          )}

          {selectedTab === "disponibilidad" && (
            <DisponibilidadTab
              disponibilidades={
                solicitud.tipoSolicitante === "INDIVIDUAL"
                  ? solicitud.voluntario?.disponibilidades || []
                  : solicitud.organizacion?.disponibilidades || []
              }
              tipoSolicitante={solicitud.tipoSolicitante}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#EAEFE0] px-6 py-4 bg-[#F8F9F3]">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-[#5B732E] text-white font-semibold hover:bg-[#556B2F] transition shadow-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}