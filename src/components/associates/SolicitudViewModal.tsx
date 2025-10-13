import { X, Download } from "lucide-react"; // 🔸 Importar Download
import { useState } from "react";
import { useDownloadSolicitudPDF } from "../../hooks/associates/useDownloadSolicitudPDF"; // 🔸 Importar hook

type Props = {
  open: boolean;
  onClose: () => void;
  solicitud: any | null;
  isLoading: boolean;
};

export function SolicitudViewModal({ open, onClose, solicitud, isLoading }: Props) {
  const [activeTab, setActiveTab] = useState<"general" | "finca">("general");
  const downloadPDF = useDownloadSolicitudPDF(); // 🔸 Usar el hook

  if (!open) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="text-center text-[#556B2F] font-medium">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!solicitud) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-[#F8F9F3] to-[#EAEFE0] p-6 border-b border-[#EAEFE0] rounded-t-2xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-[#33361D]">Detalles de la Solicitud</h3>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                  solicitud.estado === "PENDIENTE" ? "bg-yellow-100 text-yellow-800" :
                  solicitud.estado === "APROBADO" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {solicitud.estado}
                </span>
                
                {/* Indicador visual adicional */}
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${
                    solicitud.estado === "PENDIENTE" ? "bg-yellow-500" :
                    solicitud.estado === "APROBADO" ? "bg-green-500" :
                    "bg-red-500"
                  }`} />
                  <span className="text-xs text-gray-600 font-medium">
                    {solicitud.estado === "PENDIENTE" ? "En revisión" :
                     solicitud.estado === "APROBADO" ? "Aceptada" :
                     "Rechazada"}
                  </span>
                </div>
              </div>
            </div>
            
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Botón descargar PDF - En el header */}
          <div className="flex justify-start">
            <button
              onClick={() => solicitud && downloadPDF.mutate(solicitud.idSolicitud)}
              disabled={downloadPDF.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B732E] text-white font-semibold hover:bg-[#556B2F] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {downloadPDF.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#EAEFE0] px-6 bg-white">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("general")}
              className={`py-4 px-2 font-semibold transition relative ${
                activeTab === "general"
                  ? "text-[#5B732E]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Información General
              {activeTab === "general" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B732E]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("finca")}
              className={`py-4 px-2 font-semibold transition relative ${
                activeTab === "finca"
                  ? "text-[#5B732E]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Finca
              {activeTab === "finca" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B732E]" />
              )}
            </button>
          </div>
        </div>

        {/* Body - Contenido según tab activo */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {activeTab === "general" ? (
            <div className="space-y-6">
              {/* Información Personal */}
              <div>
                <h4 className="text-lg font-bold text-[#33361D] mb-4 pb-2 border-b-2 border-[#EAEFE0]">
                  Información Personal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Cédula</label>
                    <p className="text-[#33361D] font-medium">{solicitud.persona.cedula}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nombre Completo</label>
                    <p className="text-[#33361D] font-medium">
                      {solicitud.persona.nombre} {solicitud.persona.apellido1} {solicitud.persona.apellido2}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Teléfono</label>
                    <p className="text-[#33361D] font-medium">{solicitud.persona.telefono}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Email</label>
                    <p className="text-[#33361D] font-medium">{solicitud.persona.email}</p>
                  </div>
                  {solicitud.persona.fechaNacimiento && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Fecha de Nacimiento</label>
                      <p className="text-[#33361D] font-medium">
                        {new Date(solicitud.persona.fechaNacimiento).toLocaleDateString('es-CR')}
                      </p>
                    </div>
                  )}
                  {solicitud.persona.direccion && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Dirección</label>
                      <p className="text-[#33361D] font-medium">{solicitud.persona.direccion}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Núcleo Familiar */}
              {solicitud.asociado?.nucleoFamiliar && (
                <div>
                  <h4 className="text-lg font-bold text-[#33361D] mb-4 pb-2 border-b-2 border-[#EAEFE0]">
                    Núcleo Familiar
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Hombres</label>
                      <p className="text-[#33361D] font-medium">{solicitud.asociado.nucleoFamiliar.nucleoHombres}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Mujeres</label>
                      <p className="text-[#33361D] font-medium">{solicitud.asociado.nucleoFamiliar.nucleoMujeres}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Total</label>
                      <p className="text-[#33361D] font-medium">{solicitud.asociado.nucleoFamiliar.nucleoTotal}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Datos del Asociado */}
              {solicitud.asociado && (
                <div>
                  <h4 className="text-lg font-bold text-[#33361D] mb-4 pb-2 border-b-2 border-[#EAEFE0]">
                    Datos del Asociado
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Vive en Finca</label>
                      <p className="text-[#33361D] font-medium">{solicitud.asociado.viveEnFinca ? "Sí" : "No"}</p>
                    </div>
                    {solicitud.asociado.marcaGanado && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Marca de Ganado</label>
                        <p className="text-[#33361D] font-medium">{solicitud.asociado.marcaGanado}</p>
                      </div>
                    )}
                    {solicitud.asociado.CVO && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">CVO</label>
                        <p className="text-[#33361D] font-medium">{solicitud.asociado.CVO}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Contenido de la pestaña Finca */}
              {solicitud.asociado?.fincas && solicitud.asociado.fincas.length > 0 ? (
                solicitud.asociado.fincas.map((finca: any, index: number) => (
                  <div key={finca.idFinca || index}>
                    <h4 className="text-lg font-bold text-[#33361D] mb-4 pb-2 border-b-2 border-[#EAEFE0]">
                      Información de la Finca
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nombre</label>
                        <p className="text-[#33361D] font-medium">{finca.nombre || "—"}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Área (Hectáreas)</label>
                        <p className="text-[#33361D] font-medium">{finca.areaHa}</p>
                      </div>
                      {finca.numeroPlano && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Número de Plano</label>
                          <p className="text-[#33361D] font-medium">{finca.numeroPlano}</p>
                        </div>
                      )}
                      {finca.geografia && (
                        <>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Ubicación</label>
                            <p className="text-[#33361D] font-medium">
                              {finca.geografia.provincia}, {finca.geografia.canton}, {finca.geografia.distrito}
                              {finca.geografia.caserio && `, ${finca.geografia.caserio}`}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Propietario */}
                    {finca.propietario?.persona && (
                      <div className="mt-6">
                        <h5 className="text-md font-bold text-[#33361D] mb-3">Propietario de la Finca</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F8F9F3] rounded-lg">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nombre</label>
                            <p className="text-[#33361D] font-medium">
                              {finca.propietario.persona.nombre} {finca.propietario.persona.apellido1} {finca.propietario.persona.apellido2}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Cédula</label>
                            <p className="text-[#33361D] font-medium">{finca.propietario.persona.cedula}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No hay información de finca disponible</p>
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