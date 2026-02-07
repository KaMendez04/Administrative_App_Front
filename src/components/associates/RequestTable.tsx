import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { GenericTable } from "../GenericTable";
import { ActionButtons } from "../ActionButtons";

export type SolicitudRow = {
  idSolicitud: number;
  persona: {
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    telefono: string;
    email: string;
  };
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  createdAt: string;
};

type RequestsTableProps = {
  data: SolicitudRow[];
  isLoading: boolean;
  isReadOnly: boolean;
  onView: (id: number) => void;
  onApprove: (sol: SolicitudRow) => void | Promise<void>; 
  onReject: (id: number) => void;
  approvingId: number | null;
};


export function RequestsTable({
  data,
  isLoading,
  isReadOnly,
  onView,
  onApprove,
  onReject,
  approvingId,
}: RequestsTableProps) {
  const columnHelper = createColumnHelper<SolicitudRow>();

  const columns: ColumnDef<SolicitudRow, any>[] = [
    columnHelper.accessor("persona.cedula", {
      header: "Cédula",
      size: 120,
      cell: (info) => (
        <div className="font-medium text-[#33361D]">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor(
      (row) => `${row.persona.nombre} ${row.persona.apellido1} ${row.persona.apellido2}`,
      {
        id: "nombreCompleto",
        header: "Nombre",
        size: 200,
        cell: (info) => (
          <div className="font-medium text-[#33361D] truncate" title={info.getValue()}>
            {info.getValue()}
          </div>
        ),
      }
    ),
    columnHelper.accessor("persona.telefono", {
      header: "Teléfono",
      size: 100,
      cell: (info) => <div className="text-[#33361D]">{info.getValue()}</div>,
    }),
    columnHelper.accessor("persona.email", {
      header: "Email",
      size: 180,
      cell: (info) => (
        <div className="text-[#33361D] truncate" title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("estado", {
      header: "Estado",
      size: 110,
      cell: (info) => (
        <span
          className={`justify-center items-center flex px-2 py-1 rounded-lg text-xs font-bold ${
            info.getValue() === "PENDIENTE"
              ? "bg-yellow-100 text-yellow-800"
              : info.getValue() === "APROBADO"
              ? "bg-[#E6EDC8] text-[#5A7018]"
              : "bg-[#F7E9E6] text-[#8C3A33]"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Fecha",
      size: 110,
      cell: (info) => (
        <div className="text-[#33361D]">
          {new Date(info.getValue()).toLocaleDateString("es-CR")}
        </div>
      ),
    }),
    columnHelper.display({
      id: "acciones",
      header: () => <div className="text-center">Acciones</div>,
      size: 160,
      cell: (info) => {
        const sol = info.row.original;
        const solicitudId = sol.idSolicitud;
        const isThisApproving = approvingId === solicitudId;

        const estado = sol.estado;
        const canApprove = (estado === "PENDIENTE" || estado === "RECHAZADO") && !isReadOnly;
        const canReject = (estado === "PENDIENTE") && !isReadOnly; // ✅ SOLO pendientes

        return (
          <ActionButtons
            onView={() => onView(solicitudId)}
            onApprove={canApprove ? () => onApprove(sol) : undefined}
            onReject={canReject ? () => onReject(solicitudId) : undefined}
            showApproveReject={canApprove || canReject}
            isApproving={isThisApproving}
            isReadOnly={isReadOnly}
          />
        );
      },

    }),
  ];

  return <GenericTable data={data} columns={columns} isLoading={isLoading} />;
}