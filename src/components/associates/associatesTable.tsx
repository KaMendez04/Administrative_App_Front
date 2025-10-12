import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";

// Tipo para los datos de la tabla
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
  // 🔸 Definir columnas con TanStack Table
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
          className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${
            info.getValue()
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
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
      header: "Acciones",
      size: 140,
      cell: (info) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onView(info.row.original.idAsociado)}
            className="px-3 py-1.5 min-w-[60px] rounded-lg border-2 border-[#5B732E] text-[#5B732E] font-semibold hover:bg-[#EAEFE0] transition text-xs"
          >
            Ver
          </button>
          {!isReadOnly && (
            <button
              onClick={() => onEdit(info.row.original.idAsociado)}
              className="px-3 py-1.5 min-w-[60px] rounded-lg bg-[#C19A3D] text-white font-semibold hover:bg-[#C6A14B] transition text-xs"
            >
              Editar
            </button>
          )}
        </div>
      ),
    }),
  ];

  // 🔸 Crear instancia de la tabla
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-[#F8F9F3] p-8 text-center text-[#556B2F] font-medium">
        Cargando...
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#F8F9F3] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ tableLayout: "fixed" }}>
          <thead className="bg-[#EAEFE0]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className="px-4 py-3 text-left text-sm font-bold text-[#33361D]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-gray-400 font-medium"
                >
                  Sin resultados
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#F8F9F3] transition border-b border-[#EAEFE0]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{ width: `${cell.column.getSize()}px` }}
                      className="px-4 py-3 text-sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}