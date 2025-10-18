interface SolicitudStatusInfoProps {
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  fechaSolicitud: string;
  fechaResolucion?: string | null;
  motivo?: string | null;
  formatDate: (dateString: string) => string;
}

export function SolicitudStatusInfo({
  estado,
  fechaSolicitud,
  fechaResolucion,
  motivo,
  formatDate,
}: SolicitudStatusInfoProps) {
  return (
    <div>
      <h4 className="text-lg font-bold text-[#33361D] mb-3">
        Estado de la Solicitud
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#F8F9F3] p-4">
          <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
            Estado
          </div>
          <div className="text-base text-[#33361D] font-medium">{estado}</div>
        </div>
        <div className="rounded-xl bg-[#F8F9F3] p-4">
          <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
            Fecha de Solicitud
          </div>
          <div className="text-base text-[#33361D] font-medium">
            {formatDate(fechaSolicitud)}
          </div>
        </div>
        {fechaResolucion && (
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Fecha de Resolución
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {formatDate(fechaResolucion)}
            </div>
          </div>
        )}
        {motivo && (
          <div className="rounded-xl bg-red-50 p-4 md:col-span-2 border border-red-200">
            <div className="text-xs font-bold text-red-700 tracking-wider uppercase mb-1">
              Motivo de Rechazo
            </div>
            <div className="text-base text-red-900 font-medium">{motivo}</div>
          </div>
        )}
      </div>
    </div>
  );
}