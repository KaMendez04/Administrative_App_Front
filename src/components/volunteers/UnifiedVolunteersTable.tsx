import type { VoluntarioIndividual, Organizacion } from "../../schemas/volunteerSchemas";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { ActionButtons } from "../ActionButtons";
import { GenericTable } from "../GenericTable";

// Tipo unificado para la tabla
export type UnifiedVolunteerRow = {
  id: number;
  tipo: "INDIVIDUAL" | "ORGANIZACION";
  identificacion: string;
  nombreCompleto: string;
  telefono: string;
  email: string;
  estado: boolean;
  original: VoluntarioIndividual | Organizacion;
};

type UnifiedVolunteersTableProps = {
  data: UnifiedVolunteerRow[];
  isLoading: boolean;
  isReadOnly?: boolean;
  onView: (id: number, tipo: "INDIVIDUAL" | "ORGANIZACION") => void;
  onEdit: (id: number, tipo: "INDIVIDUAL" | "ORGANIZACION") => void;
};

export function UnifiedVolunteersTable({
  data,
  isLoading,
  isReadOnly,
  onView,
  onEdit,
}: UnifiedVolunteersTableProps) {
  const columnHelper = createColumnHelper<UnifiedVolunteerRow>();

  const columns: ColumnDef<UnifiedVolunteerRow, any>[] = [
    columnHelper.accessor("tipo", {
      header: "Tipo",
      size: 110,
      cell: (info) => (
        <span
            className={`justify-center items-center flex px-2 py-1 rounded-lg text-xs font-bold uppercase ${
            info.getValue() === "INDIVIDUAL"
              ? "bg-[#D4E8E0] text-[#2D5F4F]"
              : "bg-[#F5E6C5] text-[#8B6C2E]"
          }`}
        >
          {info.getValue() === "INDIVIDUAL" ? "Individual" : "Organización"}
        </span>
      ),
    }),
    columnHelper.accessor("identificacion", {
      header: "Identificación",
      size: 120,
      cell: (info) => (
        <div className="font-medium text-[#33361D]">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("nombreCompleto", {
      header: "Nombre",
      size: 220,
      cell: (info) => (
        <div
          className="font-medium text-[#33361D] truncate"
          title={String(info.getValue())}
        >
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
        <div
          className="text-[#33361D] truncate"
          title={String(info.getValue())}
        >
          {info.getValue()}
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
    columnHelper.display({
      id: "acciones",
      header: () => <div className="text-center">Acciones</div>,
      size: 150,
      cell: (info) => (
        <ActionButtons
          onView={() => onView(info.row.original.id, info.row.original.tipo)}
          onEdit={() => onEdit(info.row.original.id, info.row.original.tipo)}
          showEdit={true}
          isReadOnly={isReadOnly}
        />
      ),
    }),
  ];

  return <GenericTable data={data} columns={columns} isLoading={isLoading} />;
}