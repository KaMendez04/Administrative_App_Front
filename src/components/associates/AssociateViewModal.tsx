import { useState } from "react";
import type { Associate } from "../../schemas/adminSolicitudes";
import { FincaAccordion } from "./FincaAccordion";
import { useAssociateNecesidades } from "../../hooks/associates";

type Props = {
  open: boolean;
  onClose: () => void;
  associate: Associate | null;
  isLoading?: boolean;
};

type Tab = 'info' | 'necesidades' | 'finca';

export function AssociateViewModal({ open, onClose, associate, isLoading }: Props) {
  const [selectedTab, setSelectedTab] = useState<Tab>('info');
  
  const { data: necesidades = [], isLoading: loadingNecesidades } = useAssociateNecesidades(
    selectedTab === 'necesidades' && associate ? associate.idAsociado : null
  );

  if (!open) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading || !associate) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-8"
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
    { label: "Cédula", value: associate.persona.cedula },
    { label: "Nombre completo", value: `${associate.persona.nombre} ${associate.persona.apellido1} ${associate.persona.apellido2}` },
    { label: "Fecha de nacimiento", value: formatDate(associate.persona.fechaNacimiento) },
    { label: "Teléfono", value: associate.persona.telefono },
    { label: "Email", value: associate.persona.email },
    { label: "Dirección", value: associate.persona.direccion || "—" },
  ];

  const asociadoFields = [
    { label: "Vive en finca", value: associate.viveEnFinca ? "Sí" : "No" },
    { label: "Marca de ganado", value: associate.marcaGanado || "—" },
    { label: "CVO", value: associate.CVO || "—" },
  ];

  const nucleoFamiliar = associate.nucleoFamiliar;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold text-gray-900">Información del Asociado</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              associate.estado ? "bg-[#E6EDC8] text-[#5A7018]" : "bg-[#F7E9E6] text-[#8C3A33]"
            }`}>
              {associate.estado ? "Activo" : "Inactivo"}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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
          <button
            onClick={() => setSelectedTab('necesidades')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              selectedTab === 'necesidades'
                ? 'text-[#6F8C1F]'
                : 'text-gray-600 hover:text-[#6F8C1F]'
            }`}
          >
            Necesidades
            {selectedTab === 'necesidades' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F8C1F]"></div>
            )}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {selectedTab === 'info' && (
            <div className="p-6 space-y-4">
              {/* Información Personal - Layout en columnas */}
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

              {/* Datos del Asociado y Núcleo Familiar - Layout horizontal */}
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
            </div>
          )}

          {selectedTab === 'necesidades' && (
            <div className="p-6">
              {loadingNecesidades ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#6F8C1F]"></div>
                  <p className="mt-4 text-sm text-gray-600">Cargando necesidades...</p>
                </div>
              ) : (
                <>
                  {Array.isArray(necesidades) && necesidades.length > 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                        <h4 className="text-sm font-semibold text-gray-900">Necesidades Identificadas</h4>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {necesidades.map((necesidad: any, i: number) => (
                          <div key={necesidad?.idNecesidad ?? i} className="p-5 hover:bg-gray-50 transition-colors">
                            <div className="flex gap-4">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6F8C1F] text-white flex items-center justify-center text-sm font-bold">
                                {necesidad?.orden ?? i + 1}
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed flex-1 pt-1">
                                {necesidad?.descripcion ?? "—"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                      <div className="text-gray-300 text-5xl mb-3">📝</div>
                      <p className="text-gray-500 text-sm">No hay necesidades registradas</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {selectedTab === 'finca' && (
            <div className="p-6">
              {associate.fincas && associate.fincas.length > 0 ? (
                <div className="space-y-4">
                  {associate.fincas.map((finca, idx) => (
                    <FincaAccordion
                      key={finca.idFinca}
                      finca={finca}
                      isFirst={idx === 0}
                      esPropietario={associate.esPropietario ?? false}
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