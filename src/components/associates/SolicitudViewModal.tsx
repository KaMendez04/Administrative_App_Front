import { useState } from "react";
import type { Solicitud } from "../../schemas/adminSolicitudes";
import { FincaAccordion } from "./FincaAccordion";
import { useDownloadSolicitudPDF } from "../../hooks/associates/useDownloadSolicitudPDF";
import { Download } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  solicitud: Solicitud | null;
  isLoading?: boolean;
};

type Tab = 'info' | 'finca';

export function SolicitudViewModal({ open, onClose, solicitud, isLoading }: Props) {
  const [selectedTab, setSelectedTab] = useState<Tab>('info');
  
  const downloadPDF = useDownloadSolicitudPDF();

  if (!open) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Usar UTC para evitar desfase de zona horaria
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Costa_Rica"
    });
  };

  if (isLoading || !solicitud) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#6F8C1F]"></div>
            <p className="mt-4 text-gray-600 font-medium">Cargando detalles...</p>
          </div>
        </div>
      </div>
    );
  }

  const personalFields = [
    { label: "Cédula", value: solicitud.persona.cedula },
    { label: "Nombre completo", value: `${solicitud.persona.nombre} ${solicitud.persona.apellido1} ${solicitud.persona.apellido2}` },
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

  const getEstadoColor = () => {
    switch(solicitud.estado) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800";
      case "APROBADO":
        return "bg-[#E6EDC8] text-[#5A7018]";
      case "RECHAZADO":
        return "bg-[#F7E9E6] text-[#8C3A33]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-gray-900">Detalles de la Solicitud</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor()}`}>
                {solicitud.estado}
              </span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Botón Descargar PDF */}
          <button
            onClick={() => {
              downloadPDF.mutate({ 
                solicitud, 
                associate: solicitud.asociado,
                fincas: solicitud.asociado?.fincas 
              });
            }}
            disabled={downloadPDF.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6F8C1F] text-white text-sm font-medium hover:bg-[#5A7018] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadPDF.isPending ? (
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
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 bg-gray-50">
          <button
            onClick={() => setSelectedTab('info')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              selectedTab === 'info'
                ? 'text-[#6F8C1F]'
                : 'text-gray-600 hover:text-[#6F8C1F]'
            }`}
          >
            Información General
            {selectedTab === 'info' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F8C1F]"></div>
            )}
          </button>
          {solicitud.asociado.fincas && solicitud.asociado.fincas.length > 0 && (
            <button
              onClick={() => setSelectedTab('finca')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                selectedTab === 'finca'
                  ? 'text-[#6F8C1F]'
                  : 'text-gray-600 hover:text-[#6F8C1F]'
              }`}
            >
              Fincas
              {selectedTab === 'finca' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F8C1F]"></div>
              )}
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {selectedTab === 'info' && (
            <div className="p-6 space-y-4">
              {/* Información Personal */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900">Información Personal</h4>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-x-12 gap-y-6">
                    {personalFields.map((field, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-xs font-medium text-gray-500 uppercase">
                          {field.label}
                        </div>
                        <div className="text-sm text-gray-900 font-medium">
                          {field.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Datos del Asociado y Núcleo Familiar */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-900">Datos del Asociado</h4>
                  </div>
                  <div className="p-6 space-y-4">
                    {asociadoFields.map((field, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-xs font-medium text-gray-500 uppercase">
                          {field.label}
                        </div>
                        <div className="text-sm text-gray-900 font-medium">
                          {field.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {nucleoFamiliar && (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                      <h4 className="text-sm font-semibold text-gray-900">Núcleo Familiar</h4>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-around h-full">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900">{nucleoFamiliar.nucleoHombres}</div>
                          <div className="text-xs text-gray-500 uppercase mt-1">Hombres</div>
                        </div>
                        <div className="w-px h-16 bg-gray-200"></div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900">{nucleoFamiliar.nucleoMujeres}</div>
                          <div className="text-xs text-gray-500 uppercase mt-1">Mujeres</div>
                        </div>
                        <div className="w-px h-16 bg-gray-200"></div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-[#6F8C1F]">{nucleoFamiliar.nucleoTotal}</div>
                          <div className="text-xs text-gray-500 uppercase mt-1">Total</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Estado de Solicitud */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900">Estado de Solicitud</h4>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </div>
                      <div className="text-sm text-gray-900 font-medium">
                        {solicitud.estado}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-500 uppercase">
                        Fecha de solicitud
                      </div>
                      <div className="text-sm text-gray-900 font-medium">
                        {formatDate(solicitud.createdAt)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-500 uppercase">
                        Fecha de resolución
                      </div>
                      <div className="text-sm text-gray-900 font-medium">
                        {formatDate(solicitud.fechaResolucion!)}
                      </div>
                    </div>
                    
                    {/* Motivo de rechazo */}
                    {solicitud.motivo && (
                      <div className="col-span-2 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-xs font-medium text-red-700 uppercase mb-2">
                          Motivo de rechazo
                        </div>
                        <div className="text-sm text-red-900">
                          {solicitud.motivo}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'finca' && (
            <div className="p-6">
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
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <div className="text-gray-300 text-5xl mb-3">🏡</div>
                  <p className="text-gray-500 text-sm">No hay fincas registradas</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-3 bg-white flex justify-end">
          <button 
            onClick={onClose} 
            className="px-6 py-2 rounded-lg bg-[#6F8C1F] text-white text-sm font-medium hover:bg-[#5A7018] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}