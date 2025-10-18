import type { VoluntarioIndividual } from "../../schemas/volunteerSchemas";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { ActionButtons } from "../ActionButtons";
import { GenericTable } from "../GenericTable";

type VolunteersApprovedTableProps = {
  data: VoluntarioIndividual[];
  isLoading: boolean;
  isReadOnly?: boolean;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
};

export function VolunteersApprovedTable({
  data,
  isLoading,
  isReadOnly,
  onView,
  onEdit,
}: VolunteersApprovedTableProps) {
  const columnHelper = createColumnHelper<VoluntarioIndividual>();

  const columns: ColumnDef<VoluntarioIndividual, any>[] = [
    columnHelper.accessor((row) => row.persona.cedula, {
      id: "cedula",
      header: "Cédula",
      size: 100,
      cell: (info) => <div className="font-medium text-[#33361D]">{info.getValue()}</div>,
    }),
    columnHelper.accessor(
      (row) =>
        `${row.persona.nombre ?? ""} ${row.persona.apellido1 ?? ""} ${row.persona.apellido2 ?? ""}`.trim(),
      {
        id: "nombreCompleto",
        header: "Nombre",
        size: 200,
        cell: (info) => (
          <div className="font-medium text-[#33361D] truncate" title={String(info.getValue())}>
            {info.getValue()}
          </div>
        ),
      }
    ),
    columnHelper.accessor((row) => row.persona.telefono, {
      id: "telefono",
      header: "Teléfono",
      size: 100,
      cell: (info) => <div className="text-[#33361D]">{info.getValue()}</div>,
    }),
    columnHelper.accessor((row) => row.persona.email, {
      id: "email",
      header: "Email",
      size: 180,
      cell: (info) => (
        <div className="text-[#33361D] truncate" title={String(info.getValue())}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.isActive, {
      id: "estado",
      header: "Estado",
      size: 90,
      cell: (info) => (
        <span
          className={`justify-center items-center flex px-2 py-1 rounded-lg text-xs font-bold ${
            info.getValue() ? "bg-[#E6EDC8] text-[#5A7018]" : "bg-[#F7E9E6] text-[#8C3A33]"
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
          onView={() => onView(info.row.original.idVoluntario)}
          onEdit={() => onEdit(info.row.original.idVoluntario)}
          showEdit={true}
          isReadOnly={isReadOnly}
        />
      ),
    }),
  ];

  return <GenericTable data={data} columns={columns} isLoading={isLoading} />;
}