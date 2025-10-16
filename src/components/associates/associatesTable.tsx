import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { GenericTable } from "../GenericTable";
import { ActionButtons } from "../ActionButtons";

export type AssociateRow = {
  idAsociado: number;
  cedula: string;
  nombreCompleto: string;
  telefono: string;
  email: string;
  marcaGanado: string | null;
  estado: boolean;
  createdAt: string;
};

type AssociatesTableProps = {
  data: AssociateRow[];
  isLoading: boolean;
  isReadOnly: boolean;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
};

export function AssociatesTable({
  data,
  isLoading,
  isReadOnly,
  onView,
  onEdit,
}: AssociatesTableProps) {
  const columnHelper = createColumnHelper<AssociateRow>();

  const columns: ColumnDef<AssociateRow, any>[] = [
    columnHelper.accessor("cedula", {
      header: "Cédula",
      size: 100,
      cell: (info) => (
        <div className="font-medium text-[#33361D]">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("nombreCompleto", {
      header: "Nombre",
      size: 200,
      cell: (info) => (
        <div className="font-medium text-[#33361D] truncate" title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("telefono", {
      header: "Teléfono",
      size: 100,
      cell: (info) => <div className="text-[#33361D]">{info.getValue()}</div>,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      size: 180,
      cell: (info) => (
        <div className="text-[#33361D] truncate" title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("marcaGanado", {
      header: "Marca Ganado",
      size: 120,
      cell: (info) => (
        <div className="font-medium text-[#33361D]">
          {info.getValue() || "—"}
        </div>
      ),
    }),
    columnHelper.accessor("estado", {
      header: "Estado",
      size: 90,
      cell: (info) => (
        <span
          className={`justify-center items-center flex px-2 py-1 rounded-lg text-xs font-bold ${
            info.getValue()
              ? "bg-[#E6EDC8] text-[#5A7018]"
              : "bg-[#F7E9E6] text-[#8C3A33]"
          }`}
        >
          {info.getValue() ? "Activo" : "Inactivo"}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Fecha",
      size: 100,
      cell: (info) => (
        <div className="text-[#33361D]">
          {new Date(info.getValue()).toLocaleDateString("es-CR")}
        </div>
      ),
    }),
    columnHelper.display({
      id: "acciones",
      header: () => <div className="text-center">Acciones</div>,
      size: 150,
      cell: (info) => (
        <ActionButtons
          onView={() => onView(info.row.original.idAsociado)}
          onEdit={() => onEdit(info.row.original.idAsociado)}
          showEdit={true}
          isReadOnly={isReadOnly}
        />
      ),
    }),
  ];

  return <GenericTable data={data} columns={columns} isLoading={isLoading} />;
}