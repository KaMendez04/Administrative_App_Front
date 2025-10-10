import type { Associate } from "../../schemas/adminSolicitudes";
import { FincaAccordion } from "./FincaAccordion";

type Props = {
  open: boolean;
  onClose: () => void;
  associate: Associate | null;
  isLoading?: boolean;
};

export function AssociateViewModal({ open, onClose, associate, isLoading }: Props) {
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
  ];

  const nucleoFamiliar = associate.nucleoFamiliar;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#F8F9F3] to-[#EAEFE0] p-6 border-b border-[#EAEFE0] rounded-t-2xl z-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#33361D]">Detalles del Asociado</h3>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                  associate.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {associate.estado ? "Activo" : "Inactivo"}
                </span>
                
                {/* Indicador visual adicional */}
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${associate.estado ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-xs text-gray-600 font-medium">
                    {associate.estado ? "En operación" : "Sin acceso"}
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
        </div>

        <div className="p-6 space-y-6">
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

          {/* Footer */}
          <div className="flex justify-end pt-4">
            <button onClick={onClose} className="px-6 py-3 rounded-xl bg-[#5B732E] text-white font-semibold hover:bg-[#556B2F] transition shadow-sm">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}