import type { AdminAssociate } from "../../schemas/adminAssociates";

type Props = {
  rows: AdminAssociate[];
  onView: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  actionsFor?: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "ALL";
};

export function AssociateTable({ rows, onView, onApprove, onReject, actionsFor = "ALL" }: Props) {
  return (
    <div className="overflow-auto border rounded bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2">Cédula</th>
            <th className="text-left p-2">Nombre</th>
            <th className="text-left p-2">Teléfono</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Estado</th>
            <th className="text-left p-2">Fecha</th>
            <th className="text-left p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.cedula}</td>
              <td className="p-2">{`${r.nombre} ${r.apellido1} ${r.apellido2}`}</td>
              <td className="p-2">{r.telefono}</td>
              <td className="p-2">{r.email}</td>
              <td className="p-2">{r.estado}</td>
              <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
              <td className="p-2 flex gap-2">
                <button className="px-2 py-1 border rounded" onClick={() => onView(r.id)}>Ver</button>
                {(actionsFor === "ALL" || actionsFor === "PENDIENTE") && r.estado === "PENDIENTE" && (
                  <>
                    <button className="px-2 py-1 border rounded bg-green-600 text-white" onClick={() => onApprove(r.id)}>Aprobar</button>
                    <button className="px-2 py-1 border rounded bg-red-600 text-white" onClick={() => onReject(r.id)}>Rechazar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={7}>No hay resultados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
