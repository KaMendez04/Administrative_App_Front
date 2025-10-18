import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

import type { Organizacion } from "../../../schemas/volunteerSchemas";
import { ActionButtons } from "../../ActionButtons";
import { GenericTable } from "../../GenericTable";
type OrganizationsApprovedTableProps = {
  data: Organizacion[];
  isLoading: boolean;
  isReadOnly?: boolean;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
};

export type OrganizationApprovedRow = {
  idOrganizacion: number;
  cedulaJuridica: string;
  nombre: string;
  telefono: string;
  email: string;
  tipoOrganizacion: string;
  estado: boolean;
};

export function OrganizationsApprovedTable({
  data,
  isLoading,
  isReadOnly,
  onView,
  onEdit,
}: OrganizationsApprovedTableProps) {
  const columnHelper = createColumnHelper<Organizacion>();

  const columns: ColumnDef<Organizacion, any>[] = [
    columnHelper.accessor((row) => row.cedulaJuridica, {
      id: "cedulaJuridica",
      header: "Cédula Jurídica",
      size: 120,
      cell: (info) => (
        <div className="font-medium text-[#33361D]">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor((row) => row.nombre, {
      id: "nombre",
      header: "Nombre de la Organización",
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
    columnHelper.accessor((row) => row.telefono, {
      id: "telefono",
      header: "Teléfono",
      size: 100,
      cell: (info) => <div className="text-[#33361D]">{info.getValue()}</div>,
    }),
    columnHelper.accessor((row) => row.email, {
      id: "email",
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
    columnHelper.accessor((row) => row.tipoOrganizacion, {
      id: "tipoOrganizacion",
      header: "Tipo",
      size: 120,
      cell: (info) => (
        <div className="text-[#33361D] text-sm">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor((row) => row.isActive, {
      id: "estado",
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
          onView={() => onView(info.row.original.idOrganizacion)}
          onEdit={() => onEdit(info.row.original.idOrganizacion)}
          showEdit={true}
          isReadOnly={isReadOnly}
        />
      ),
    }),
  ];

  return <GenericTable data={data} columns={columns} isLoading={isLoading} />;
}