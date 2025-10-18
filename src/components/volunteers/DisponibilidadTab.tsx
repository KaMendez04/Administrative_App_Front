import type { Disponibilidad } from "../../schemas/volunteerSchemas";

interface DisponibilidadTabProps {
  disponibilidades: Disponibilidad[];
  tipoSolicitante: "INDIVIDUAL" | "ORGANIZACION";
}

export function DisponibilidadTab({
  disponibilidades,
  tipoSolicitante,
}: DisponibilidadTabProps) {
  const borderColor =
    tipoSolicitante === "INDIVIDUAL" ? "border-[#5B732E]" : "border-[#8C3A33]";

  if (!disponibilidades || disponibilidades.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-[#556B2F] text-lg mb-2">
          📅 No hay horarios de disponibilidad registrados
        </div>
        <p className="text-sm text-[#556B2F] opacity-75">
          Los horarios aparecerán aquí una vez sean definidos
        </p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-lg font-bold text-[#33361D] mb-4">
        Horarios de Disponibilidad
      </h4>
      <div className="space-y-4">
        {disponibilidades.map((disp) => (
          <div
            key={disp.idDisponibilidad}
            className={`rounded-xl bg-[#F8F9F3] p-4 border-l-4 ${borderColor}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                  Días
                </div>
                <div className="text-base text-[#33361D] font-medium">
                  {disp.dias}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                  Horario
                </div>
                <div className="text-base text-[#33361D] font-medium">
                  {disp.horario}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                  Período
                </div>
                <div className="text-base text-[#33361D] font-medium">
                  {new Date(disp.fechaInicio).toLocaleDateString()} -{" "}
                  {new Date(disp.fechaFin).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}