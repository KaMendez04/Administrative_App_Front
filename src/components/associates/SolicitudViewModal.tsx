import type { Solicitud } from "../../schemas/adminSolicitudes";

type Props = {
  open: boolean;
  onClose: () => void;
  solicitud: Solicitud | null;
};

export function SolicitudViewModal({ open, onClose, solicitud }: Props) {
  if (!open || !solicitud) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
    { label: "Es propietario", value: solicitud.asociado.esPropietario ? "Sí" : "No" },  // ✅ Agregar
  ];

  const nucleoFamiliar = solicitud.asociado.nucleoFamiliar;
  const finca = solicitud.asociado.fincas?.[0];
  const propietario = finca?.propietario;

  const solicitudFields = [
    { label: "Estado", value: solicitud.estado },
    { label: "Fecha de solicitud", value: formatDate(solicitud.createdAt) },
  ];

  if (solicitud.motivo) {
    solicitudFields.push({ label: "Motivo de rechazo", value: solicitud.motivo });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-[#F8F9F3] to-[#EAEFE0] p-6 border-b border-[#EAEFE0] rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#33361D]">Detalles de la Solicitud</h3>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                  solicitud.estado === "PENDIENTE" ? "bg-yellow-100 text-yellow-800" :
                  solicitud.estado === "APROBADO" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {solicitud.estado}
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

          {/* Datos de la Finca */}
          {finca && (
            <div>
              <h4 className="text-lg font-bold text-[#33361D] mb-3">Datos de la Finca</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#F8F9F3] p-4">
                  <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Nombre</div>
                  <div className="text-base text-[#33361D] font-medium">{finca.nombre}</div>
                </div>
                <div className="rounded-xl bg-[#F8F9F3] p-4">
                  <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Área (ha)</div>
                  <div className="text-base text-[#33361D] font-medium">{finca.areaHa}</div>
                </div>
                <div className="rounded-xl bg-[#F8F9F3] p-4">
                  <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Número de Plano</div>
                  <div className="text-base text-[#33361D] font-medium">{finca.numeroPlano}</div>
                </div>
                {finca.geografia && (
                  <div className="rounded-xl bg-[#F8F9F3] p-4">
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Ubicación</div>
                    <div className="text-base text-[#33361D] font-medium">
                      {finca.geografia.provincia}, {finca.geografia.canton}, {finca.geografia.distrito}
                      {finca.geografia.caserio && `, ${finca.geografia.caserio}`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Propietario (solo si NO es el asociado) */}
          {propietario && !solicitud.asociado.esPropietario && (
            <div>
              <h4 className="text-lg font-bold text-[#33361D] mb-3">Propietario de la Finca</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#FEF6E0] p-4">
                  <div className="text-xs font-bold text-[#C19A3D] tracking-wider uppercase mb-1">Nombre completo</div>
                  <div className="text-base text-[#33361D] font-medium">
                    {`${propietario.persona.nombre} ${propietario.persona.apellido1} ${propietario.persona.apellido2}`}
                  </div>
                </div>
                <div className="rounded-xl bg-[#FEF6E0] p-4">
                  <div className="text-xs font-bold text-[#C19A3D] tracking-wider uppercase mb-1">Cédula</div>
                  <div className="text-base text-[#33361D] font-medium">{propietario.persona.cedula}</div>
                </div>
                <div className="rounded-xl bg-[#FEF6E0] p-4">
                  <div className="text-xs font-bold text-[#C19A3D] tracking-wider uppercase mb-1">Teléfono</div>
                  <div className="text-base text-[#33361D] font-medium">{propietario.persona.telefono}</div>
                </div>
                <div className="rounded-xl bg-[#FEF6E0] p-4">
                  <div className="text-xs font-bold text-[#C19A3D] tracking-wider uppercase mb-1">Email</div>
                  <div className="text-base text-[#33361D] font-medium">{propietario.persona.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Estado de Solicitud */}
          <div>
            <h4 className="text-lg font-bold text-[#33361D] mb-3">Estado de Solicitud</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {solicitudFields.map((field, idx) => (
                <div key={idx} className={`rounded-xl bg-[#F8F9F3] p-4 ${field.label === "Motivo de rechazo" ? "md:col-span-2" : ""}`}>
                  <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">{field.label}</div>
                  <div className="text-base text-[#33361D] font-medium">{field.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hato */}
{finca?.hato && (
  <div>
    <h4 className="text-lg font-bold text-[#33361D] mb-3">Hato</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-xl bg-[#F8F9F3] p-4">
        <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
          Tipo de explotación
        </div>
        <div className="text-base text-[#33361D] font-medium">
          {finca.hato?.tipoExplotacion ?? "—"}
        </div>
      </div>

      <div className="rounded-xl bg-[#F8F9F3] p-4">
        <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
          Total de ganado
        </div>
        <div className="text-base text-[#33361D] font-medium">
          {finca.hato?.totalGanado ?? "—"}
        </div>
      </div>

      <div className="rounded-xl bg-[#F8F9F3] p-4">
        <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
          Raza predominante
        </div>
        <div className="text-base text-[#33361D] font-medium">
          {finca.hato?.razaPredominante ?? "—"}
        </div>
      </div>

      {Array.isArray(finca.hato?.animales) && finca.hato!.animales.length > 0 && (
        <div className="rounded-xl bg-[#F8F9F3] p-4 md:col-span-2">
          <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
            Animales
          </div>
          <div className="space-y-2">
            {finca.hato!.animales.map((a, i) => (
              <div
                key={a.idAnimal ?? i}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-[#EAEFE0] bg-white px-3 py-2"
              >
                <div className="text-sm font-semibold text-[#33361D]">{a.nombre ?? "—"}</div>
                <div className="text-xs text-[#33361D]">Edad: {a.edad ?? "—"}</div>
                <div className="text-xs text-[#33361D]">Cantidad: {a.cantidad ?? "—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}

{/* Forrajes — fuera del cuadro, mismo diseño que Estado de Solicitud */}
{Array.isArray(finca?.forrajes) && finca.forrajes.length > 0 && (
  <div className="mt-4">
    <h4 className="text-lg font-bold text-[#33361D] mb-3">Forrajes</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {finca.forrajes.map((f, i) => (
        <div key={f.idForraje ?? i} className="rounded-xl bg-[#F8F9F3] p-4 md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Tipo de forraje</div>
              <div className="text-base text-[#33361D] font-medium">{f.tipoForraje ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Variedad</div>
              <div className="text-base text-[#33361D] font-medium">{f.variedad ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Hectáreas</div>
              <div className="text-base text-[#33361D] font-medium">{f.hectareas ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Utilización</div>
              <div className="text-base text-[#33361D] font-medium">{f.utilizacion ?? "—"}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


{/* Registros productivos y Fuentes de agua */}
{(finca?.registrosProductivos || (Array.isArray(finca?.fuentesAgua) && finca!.fuentesAgua.length > 0)) && (
  <div className="mt-4">
    <h4 className="text-lg font-bold text-[#33361D] mb-3">Registros productivos y fuentes de agua</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {finca?.registrosProductivos && (
        <>
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Reproductivos</div>
            <div className="text-base text-[#33361D] font-medium">
              {finca.registrosProductivos.reproductivos ? "Sí" : "No"}
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Costos productivos</div>
            <div className="text-base text-[#33361D] font-medium">
              {finca.registrosProductivos.costosProductivos ? "Sí" : "No"}
            </div>
          </div>
        </>
      )}

      {Array.isArray(finca?.fuentesAgua) && finca.fuentesAgua.length > 0 && (
        <div className="rounded-xl bg-[#F8F9F3] p-4 md:col-span-2">
          <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Fuentes de agua</div>
          <div className="space-y-2">
            {finca.fuentesAgua.map((fa, i) => (
              <div
                key={fa.idFuenteAgua ?? i}
                className="flex items-center justify-between gap-2 rounded border border-[#EAEFE0] bg-white px-3 py-2"
              >
                <div className="text-sm font-semibold text-[#33361D]">{fa.nombre ?? "—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}






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