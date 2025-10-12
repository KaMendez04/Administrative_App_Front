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

// 🔸 ICONOS SVG
const EyeIcon = () => (
  <svg 
    className="w-5 h-5" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
    />
  </svg>
);

const PencilIcon = () => (
  <svg 
    className="w-5 h-5" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
    />
  </svg>
);

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
       header: () => (
        <div className="text-center">Acciones</div> // 🔸 Header centrado
      ),
      size: 150, // 🔸 Aumentado para dar más espacio
      cell: (info) => (
        <div className="flex gap-3 justify-center items-center"> {/* 🔸 gap-3 y justify-center */}
          {/* 🔸 BOTÓN VER CON ICONO DE OJO */}
          <button
            onClick={() => onView(info.row.original.idAsociado)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F9F3] text-[#5B732E] hover:bg-[#EAEFE0] transition-all duration-200 shadow-sm hover:shadow-md"
            title="Ver detalles"
            aria-label="Ver detalles del asociado"
          >
            <EyeIcon />
          </button>

          {/* 🔸 BOTÓN EDITAR CON ICONO DE LÁPIZ */}
          {!isReadOnly && (
            <button
              onClick={() => onEdit(info.row.original.idAsociado)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#C19A3D] text-white hover:bg-[#A3853D] transition-all duration-200 shadow-sm hover:shadow-md"
              title="Editar asociado"
              aria-label="Editar asociado"
            >
              <PencilIcon />
            </button>
          )}
        </div>
      ),
    }),
  ];

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