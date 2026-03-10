import { useState } from "react";
import type { Solicitud } from "../../schemas/adminSolicitudes";
import { FincaAccordion } from "./FincaAccordion";
import { Download, FolderOpen } from "lucide-react";
import { useDownloadSolicitudPDF } from "../../hooks/associates/useDownloadSolicitudPDF";
import { useSolicitudHasDocs, useDocsLinkBySolicitud } from "../../hooks/associates/useSolicitudDocsLink";
import { toast } from "sonner";
import { useLockBodyScroll } from "@/hooks/modals/useLockBodyScroll";

type Props = {
  open: boolean;
  onClose: () => void;
  solicitud: Solicitud | null;
  isLoading?: boolean;
};

type Tab = "info" | "finca";

export function SolicitudViewModal({ open, onClose, solicitud, isLoading }: Props) {
  const [selectedTab, setSelectedTab] = useState<Tab>("info");
  const openSolicitudPDF = useDownloadSolicitudPDF();

  // ✅ Hooks siempre arriba, antes de cualquier return
  const docsLink = useDocsLinkBySolicitud();
  const { data: hasDocs, isLoading: checkingDocs } = useSolicitudHasDocs(
    solicitud ? Number(solicitud.idSolicitud) : null
  );

  useLockBodyScroll(open);
    
  if (!open) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B732E]"></div>
            <p className="mt-4 text-[#556B2F] font-medium">Cargando detalles...</p>
          </div>
        </div>
      </div>
    );
  }

  const personalFields = [
    { label: "Cédula", value: solicitud.persona.cedula },
    {
      label: "Nombre completo",
      value: `${solicitud.persona.nombre} ${solicitud.persona.apellido1} ${solicitud.persona.apellido2}`,
    },
    { label: "Fecha de nacimiento", value: formatDate(solicitud.persona.fechaNacimiento) },
    { label: "Teléfono", value: solicitud.persona.telefono },
    { label: "Email", value: solicitud.persona.email },
    { label: "Dirección", value: solicitud.persona.direccion || "—" },
  ];

  const asociadoFields = [
    { label: "Vive en finca", value: solicitud.asociado.viveEnFinca ? "Sí" : "No" },
    { label: "Marca de ganado", value: solicitud.asociado.marcaGanado || "—" },
    { label: "CVO", value: solicitud.asociado.CVO || "—" },
  ];

  const nucleoFamiliar = solicitud.asociado.nucleoFamiliar;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F8F9F3] to-[#EAEFE0] p-6 border-b border-[#EAEFE0] rounded-t-2xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-[#33361D]">Detalles de la Solicitud</h3>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-bold ${
                    solicitud.estado === "PENDIENTE"
                      ? "bg-yellow-100 text-yellow-800"
                      : solicitud.estado === "APROBADO"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {solicitud.estado}
                </span>

                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      solicitud.estado === "PENDIENTE"
                        ? "bg-yellow-500"
                        : solicitud.estado === "APROBADO"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-xs text-gray-600 font-medium">
                    {solicitud.estado === "PENDIENTE"
                      ? "En revisión"
                      : solicitud.estado === "APROBADO"
                      ? "Aceptada"
                      : "Rechazada"}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* BOTONES */}
          <div className="flex flex-wrap gap-2 justify-start">
            {/* ✅ Descargar PDF */}
            <button
              onClick={() => openSolicitudPDF.mutate(Number(solicitud?.idSolicitud))}
              disabled={openSolicitudPDF.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B732E] text-white font-semibold hover:bg-[#556B2F] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

            {/* Documentos: skeleton → botón → texto */}
            {checkingDocs ? (
              <div className="h-9 w-36 rounded-xl bg-gray-200 animate-pulse" />
            ) : hasDocs ? (
              <button
                onClick={() => {
                  docsLink.mutate(Number(solicitud.idSolicitud), {
                    onSuccess: (r) => window.open(r.url, "_blank", "noopener,noreferrer"),
                    onError: (err: any) => {
                      const msg = err?.response?.data?.message || err?.message || "No se pudieron abrir los documentos";
                      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
                    },
                  });
                }}
                disabled={docsLink.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#33361D] text-white font-semibold hover:bg-[#2b2d18] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {docsLink.isPending ? (
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 text-sm font-medium">
                <FolderOpen className="w-4 h-4 opacity-50" />
                No se adjuntaron documentos
              </div>
            )}
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
          {solicitud.asociado.fincas && solicitud.asociado.fincas.length > 0 && (
            <button
              onClick={() => setSelectedTab("finca")}
              className={`px-4 py-3 font-semibold text-sm transition ${
                selectedTab === "finca"
                  ? "text-[#5B732E] border-b-2 border-[#5B732E]"
                  : "text-[#33361D] hover:text-[#5B732E]"
              }`}
            >
              Finca
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB: INFORMACIÓN GENERAL */}
          {selectedTab === "info" && (
            <div className="space-y-6">
              {/* Información Personal */}
              <div>
                <h4 className="text-lg font-bold text-[#33361D] mb-3">Información Personal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalFields.map((field, idx) => (
                    <div key={idx} className="rounded-xl bg-[#F8F9F3] p-4">
                      <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                        {field.label}
                      </div>
                      <div className="text-base text-[#33361D] font-medium">{field.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Datos del Asociado */}
              <div>
                <h4 className="text-lg font-bold text-[#33361D] mb-3">Datos del Asociado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {asociadoFields.map((field, idx) => (
                    <div key={idx} className="rounded-xl bg-[#F8F9F3] p-4">
                      <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                        {field.label}
                      </div>
                      <div className="text-base text-[#33361D] font-medium">{field.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Núcleo Familiar */}
              {nucleoFamiliar && (
                <div>
                  <h4 className="text-lg font-bold text-[#33361D] mb-3">Núcleo Familiar</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl bg-[#F8F9F3] p-4">
                      <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Hombres</div>
                      <div className="text-base text-[#33361D] font-medium">{nucleoFamiliar.nucleoHombres}</div>
                    </div>
                    <div className="rounded-xl bg-[#F8F9F3] p-4">
                      <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Mujeres</div>
                      <div className="text-base text-[#33361D] font-medium">{nucleoFamiliar.nucleoMujeres}</div>
                    </div>
                    <div className="rounded-xl bg-[#FEF6E0] p-4">
                      <div className="text-xs font-bold text-[#C19A3D] tracking-wider uppercase mb-1">Total</div>
                      <div className="text-base text-[#33361D] font-medium">{nucleoFamiliar.nucleoTotal}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Estado de Solicitud */}
              <div>
                <h4 className="text-lg font-bold text-[#33361D] mb-3">Estado de Solicitud</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#F8F9F3] p-4">
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Estado</div>
                    <div className="text-base text-[#33361D] font-medium">{solicitud.estado}</div>
                  </div>
                  <div className="rounded-xl bg-[#F8F9F3] p-4">
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                      Fecha de solicitud
                    </div>
                    <div className="text-base text-[#33361D] font-medium">{formatDate(solicitud.createdAt)}</div>
                  </div>

                  {/* Motivo de rechazo - si existe */}
                  {solicitud.motivo && (
                    <div className="rounded-xl bg-red-50 p-4 md:col-span-2 border border-red-200">
                      <div className="text-xs font-bold text-red-700 tracking-wider uppercase mb-1">
                        Motivo de rechazo
                      </div>
                      <div className="text-base text-red-900 font-medium">{solicitud.motivo}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: FINCA */}
          {selectedTab === "finca" && (
            <div>
              {solicitud.asociado.fincas && solicitud.asociado.fincas.length > 0 ? (
                <div className="space-y-4">
                  {solicitud.asociado.fincas.map((finca, idx) => (
                    <FincaAccordion
                      key={finca.idFinca}
                      finca={finca}
                      isFirst={idx === 0}
                      esPropietario={solicitud.asociado.esPropietario ?? false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-[#556B2F] text-lg mb-2">🏡 No hay fincas registradas</div>
                  <p className="text-sm text-[#556B2F] opacity-75">
                    Las fincas del asociado aparecerán aquí una vez sean registradas
                  </p>
                </div>
              )}
            </div>
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
  );
}