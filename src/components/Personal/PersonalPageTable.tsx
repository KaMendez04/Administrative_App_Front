import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { GenericTable } from "../GenericTable";
import { ActionButtons } from "../ActionButtons";
import type { PersonalPageType } from "../../models/PersonalPageType";

type PersonalTableProps = {
  data: PersonalPageType[];
  isLoading: boolean;
  isReadOnly: boolean;
  onView: (item: PersonalPageType) => void;
  onEdit: (item: PersonalPageType) => void;
};

export function PersonalTable({
  data,
  isLoading,
  isReadOnly,
  onView,
  onEdit,
}: PersonalTableProps) {
  const columnHelper = createColumnHelper<PersonalPageType>();

  const columns: ColumnDef<PersonalPageType, any>[] = [
    columnHelper.accessor("IDE", {
      header: "Cédula",
      size: 120,
      cell: (info) => (
        <div className="font-medium text-[#33361D]">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor(
      (row) => `${row.name} ${row.lastname1} ${row.lastname2}`,
      {
        id: "nombreCompleto",
        header: "Nombre Completo",
        size: 250,
        cell: (info) => (
          <div className="font-medium text-[#33361D] truncate" title={info.getValue()}>
            {info.getValue()}
          </div>
        ),
      }
    ),
    columnHelper.accessor("phone", {
      header: "Teléfono",
      size: 120,
      cell: (info) => <div className="text-[#33361D]">{info.getValue()}</div>,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      size: 180,
      cell: (info) => (
        <div className=" text-[#33361D] truncate" title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("occupation", {
      header: "Puesto",
      size: 150,
      cell: (info) => (
        <div className="text-[#33361D]">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("isActive", {
      header: "Estado",
      size: 100,
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
          onView={() => onView(info.row.original)}
          onEdit={() => onEdit(info.row.original)}
          showEdit={true}
          isReadOnly={isReadOnly}
        />
      ),
    }),
  ];

  return <GenericTable data={data} columns={columns} isLoading={isLoading} />;
}