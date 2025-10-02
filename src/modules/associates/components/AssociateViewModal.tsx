import type { AdminAssociate } from "../schemas/adminAssociates";

type Props = {
  open: boolean;
  onClose: () => void;
  associate: AdminAssociate | null;
};

export function AssociateViewModal({ open, onClose, associate }: Props) {
  if (!open || !associate) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fields = [
    { label: "Cédula", value: associate.cedula },
    { label: "Nombre completo", value: `${associate.nombre} ${associate.apellido1} ${associate.apellido2}` },
    { label: "Fecha de nacimiento", value: formatDate(associate.fechaNacimiento) },
    { label: "Teléfono", value: associate.telefono },
    { label: "Email", value: associate.email },
    { label: "Dirección", value: associate.direccion || "—" },
    { label: "Distancia a finca", value: associate.distanciaFinca ? `${associate.distanciaFinca} km` : "—" },
    { label: "Vive en finca", value: associate.viveEnFinca ? "Sí" : "No" },
    { label: "Marca de ganado", value: associate.marcaGanado || "—" },
    { label: "CVO", value: associate.CVO || "—" },
    { label: "Estado", value: associate.estado },
  ];

  if (associate.motivoRechazo) {
    fields.push({ label: "Motivo de rechazo", value: associate.motivoRechazo });
  }

  fields.push(
    { label: "Fecha de solicitud", value: formatDate(associate.createdAt) },
    { label: "Última actualización", value: formatDate(associate.updatedAt) }
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-[#F8F9F3] to-[#EAEFE0] p-6 border-b border-[#EAEFE0] rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#33361D]">Detalles del Asociado</h3>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                  associate.estado === "PENDIENTE" ? "bg-yellow-100 text-yellow-800" :
                  associate.estado === "APROBADO" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {associate.estado}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, idx) => (
              <div 
                key={idx} 
                className={`rounded-xl bg-[#F8F9F3] p-4 ${
                  field.label === "Motivo de rechazo" ? "md:col-span-2" : ""
                }`}
              >
                <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                  {field.label}
                </div>
                <div className="text-base text-[#33361D] font-medium">
                  {field.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
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