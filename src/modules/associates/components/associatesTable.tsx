import type { AdminAssociate } from "../schemas/adminAssociates";

type Props = {
  rows: AdminAssociate[];
  onView: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  actionsFor?: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "ALL";
};

export function AssociateTable({ rows, onView, onApprove, onReject, actionsFor = "ALL" }: Props) {
  return (
    <>
      <div className="bg-[#EAEFE0] px-4 py-3">
        <div className="grid grid-cols-7 gap-4 text-sm font-bold text-[#33361D]">
          <div>Cédula</div>
          <div>Nombre</div>
          <div>Teléfono</div>
          <div>Email</div>
          <div>Estado</div>
          <div>Fecha</div>
          <div className="text-right">Acciones</div>
        </div>
      </div>
      <div className="bg-white">
        {rows.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-7 gap-4 px-4 py-3 text-sm text-[#33361D] hover:bg-[#F8F9F3] transition"
          >
            <div className="font-medium">{r.cedula}</div>
            <div className="font-medium">{`${r.nombre} ${r.apellido1} ${r.apellido2}`}</div>
            <div>{r.telefono}</div>
            <div className="truncate">{r.email}</div>
            <div>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                r.estado === "PENDIENTE" ? "bg-yellow-100 text-yellow-800" :
                r.estado === "APROBADO" ? "bg-green-100 text-green-800" :
                "bg-red-100 text-red-800"
              }`}>
                {r.estado}
              </span>
            </div>
            <div>{new Date(r.createdAt).toLocaleDateString("es-CR")}</div>
            <div className="text-right flex gap-2 justify-end">
              <button
                onClick={() => onView(r.id)}
                className="px-3 py-1 rounded-lg border-2 border-[#5B732E] text-[#5B732E] font-semibold hover:bg-[#EAEFE0] transition text-xs"
              >
                Ver
              </button>
              {(actionsFor === "ALL" || actionsFor === "PENDIENTE") && r.estado === "PENDIENTE" && (
                <>
                  <button
                    onClick={() => onApprove(r.id)}
                    className="px-3 py-1 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition text-xs"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => onReject(r.id)}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition text-xs"
                  >
                    Rechazar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="py-8 text-center text-gray-400 font-medium">
            Sin resultados
          </div>
        )}
      </div>
    </>
  );
}