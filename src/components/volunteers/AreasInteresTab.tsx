import type { AreaInteres } from "../../schemas/volunteerSchemas";

interface AreasInteresTabProps {
  areasInteres: AreaInteres[];
  tipoSolicitante: "INDIVIDUAL" | "ORGANIZACION";
}

export function AreasInteresTab({
  areasInteres,
  tipoSolicitante,
}: AreasInteresTabProps) {
  const colorClasses =
    tipoSolicitante === "INDIVIDUAL" || tipoSolicitante === "ORGANIZACION"
      ? "bg-[#E6EDC8] text-[#5A7018]"
      : "bg-[#E6C3B4] text-[#8C3A33]";

  if (!areasInteres || areasInteres.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-[#556B2F] text-lg mb-2">
          📋 No hay áreas de interés registradas
        </div>
        <p className="text-sm text-[#556B2F] opacity-75">
          Las áreas de interés aparecerán aquí una vez sean definidas
        </p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-lg font-bold text-[#33361D] mb-4">
        Áreas de Interés
      </h4>
      <div className="flex flex-wrap gap-3">
        {areasInteres.map((area) => (
          <div
            key={area.idAreaInteres}
            className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow ${colorClasses}`}
          >
            {area.nombreArea}
          </div>
        ))}
      </div>
    </div>
  );
}