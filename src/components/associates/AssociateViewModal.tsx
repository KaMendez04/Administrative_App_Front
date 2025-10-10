import { useState } from "react";
import type { Associate } from "../../schemas/adminSolicitudes";
import { FincaAccordion } from "./FincaAccordion";
import { useAssociateNecesidades } from "../../hooks/associates"; // ✅ AGREGAR

type Props = {
  open: boolean;
  onClose: () => void;
  associate: Associate | null;
  isLoading?: boolean;
};

export function AssociateViewModal({ open, onClose, associate, isLoading }: Props) {
  const [selectedTab, setSelectedTab] = useState<'info' | 'necesidades'>('info'); // ✅ AGREGAR
  
  // ✅ Hook para cargar necesidades
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
    { label: "Es propietario", value: associate.esPropietario ? "Sí" : "No" },
    { label: "Estado", value: associate.estado ? "Activo" : "Inactivo" },
  ];

  const nucleoFamiliar = associate.nucleoFamiliar;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F8F9F3] to-[#EAEFE0] p-6 border-b border-[#EAEFE0] rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#33361D]">Detalles del Asociado</h3>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                  associate.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {associate.estado ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ✅ TABS */}
        <div className="flex border-b border-[#EAEFE0] px-6 bg-white">
          <button
            onClick={() => setSelectedTab('info')}
            className={`px-4 py-3 font-semibold transition ${
              selectedTab === 'info'
                ? 'text-[#5B732E] border-b-2 border-[#5B732E]'
                : 'text-[#33361D] hover:text-[#5B732E]'
            }`}
          >
            Información General
          </button>
          <button
            onClick={() => setSelectedTab('necesidades')}
            className={`px-4 py-3 font-semibold transition ${
              selectedTab === 'necesidades'
                ? 'text-[#5B732E] border-b-2 border-[#5B732E]'
                : 'text-[#33361D] hover:text-[#5B732E]'
            }`}
          >
            Necesidades y Observaciones
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedTab === 'info' && (
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
                      <div className="text-base text-[#33361D] font-medium">
                        {field.value}
                      </div>
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
                      <div className="text-base text-[#33361D] font-medium">
                        {field.value}
                      </div>
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

              {/* Fincas */}
              {associate.fincas && associate.fincas.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-[#33361D] mb-3">
                    Fincas ({associate.fincas.length})
                  </h4>
                  
                  {associate.fincas.map((finca, idx) => (
                    <FincaAccordion
                      key={finca.idFinca}
                      finca={finca}
                      isFirst={idx === 0}
                      esPropietario={associate.esPropietario ?? false}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ✅ NUEVA PESTAÑA: Necesidades */}
          {selectedTab === 'necesidades' && (
            <div>
              {loadingNecesidades ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B732E]"></div>
                  <p className="mt-4 text-sm text-[#556B2F]">Cargando necesidades...</p>
                </div>
              ) : (
                <>
                  {Array.isArray(necesidades) && necesidades.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-[#33361D] mb-4 border-b-2 border-[#EAEFE0] pb-2">
                        Necesidades y Mejoras Identificadas
                      </h4>
                      {necesidades.map((necesidad: any, i: number) => (
                        <div key={necesidad?.idNecesidad ?? i} className="rounded-xl bg-[#F8F9F3] p-4 hover:bg-[#EAEFE0] transition">
                          <div className="flex items-start gap-4">
                            <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#5B732E] text-white text-sm font-bold">
                              {necesidad?.orden ?? i + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-base text-[#33361D] leading-relaxed">
                                {necesidad?.descripcion ?? "—"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-[#556B2F] text-lg mb-2">
                        📝 No hay necesidades registradas
                      </div>
                      <p className="text-sm text-[#556B2F] opacity-75">
                        Las necesidades y observaciones aparecerán aquí una vez sean registradas
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#EAEFE0] px-6 py-4 bg-[#F8F9F3]">
          <div className="flex justify-end">
            <button onClick={onClose} className="px-6 py-3 rounded-xl bg-[#5B732E] text-white font-semibold hover:bg-[#556B2F] transition shadow-sm">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}