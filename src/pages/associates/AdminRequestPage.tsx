import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import { Eye, CheckCircle, XCircle, Download } from "lucide-react";
import { useAdminSolicitudesList } from "../../hooks/associates/useAdminSolicitudesList";
import { useAdminSolicitudDetail } from "../../hooks/associates/useAdminSolicitudDetail";
import { useApproveSolicitud } from "../../hooks/associates/useApproveSolicitud";
import { useRejectSolicitud } from "../../hooks/associates/useRejectSolicitud";
import { RejectDialog } from "../../components/associates/RejectDialog";
import { SolicitudViewModal } from "../../components/associates/SolicitudViewModal";
import { getCurrentUser } from "../../services/auth";
import { useDownloadSolicitudPDF } from "../../hooks/associates/useDownloadSolicitudPDF";

type SolicitudRow = {
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

function KPICard({
  label,
  value,
  tone = "base",
}: { label: string; value: string | number; tone?: "base" | "alt" | "gold" }) {
  const toneMap = {
    base: "bg-[#F8F9F3] text-[#5B732E]",
    alt: "bg-[#EAEFE0] text-[#5B732E]",
    gold: "bg-[#FEF6E0] text-[#C19A3D]",
  } as const;
  return (
    <div className={`rounded-2xl ${toneMap[tone]} p-5 shadow-sm`}>
      <div className="text-xs font-bold tracking-wider uppercase opacity-80">{label}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}

export default function AdminRequestsPage() {
  const [status, setStatus] = useState<"PENDIENTE"|"APROBADO"|"RECHAZADO"|undefined>("PENDIENTE");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const role = getCurrentUser()?.role?.name?.toUpperCase();
  const isReadOnly = role === "JUNTA";

  const { data, isLoading } = useAdminSolicitudesList({ 
    status, 
    search, 
    page, 
    limit, 
    sort: "createdAt:desc" 
  });
  
  const approve = useApproveSolicitud();
  const reject = useRejectSolicitud();

  const [rejectId, setRejectId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);
   const downloadPDF = useDownloadSolicitudPDF();
  const { data: viewDetail, isLoading: isLoadingDetail } = useAdminSolicitudDetail(viewId ?? 0);

  const columnHelper = createColumnHelper<SolicitudRow>();

  const columns: ColumnDef<SolicitudRow, any>[] = [
    columnHelper.accessor("persona.cedula", {
      header: "Cédula",
      size: 120,
      cell: (info) => (
        <div className="font-medium text-[#33361D]">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor((row) => `${row.persona.nombre} ${row.persona.apellido1} ${row.persona.apellido2}`, {
      id: "nombreCompleto",
      header: "Nombre",
      size: 200,
      cell: (info) => (
        <div className="font-medium text-[#33361D] truncate" title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
    }),
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
        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${
          info.getValue() === "PENDIENTE" ? "bg-yellow-100 text-yellow-800" :
          info.getValue() === "APROBADO" ? "bg-green-100 text-green-800" :
          "bg-red-100 text-red-800"
        }`}>
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
      header: () => (
        <div className="text-center">Acciones</div>
      ),
      size: 160,
      cell: (info) => (
        <div className="flex gap-2 justify-center items-center">
          {/* Botón Ver */}
          <button
            onClick={() => setViewId(info.row.original.idSolicitud)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F9F3] text-[#5B732E] hover:bg-[#EAEFE0] transition-all duration-200 shadow-sm hover:shadow-md"
            title="Ver detalles"
            aria-label="Ver detalles de la solicitud"
          >
            <Eye className="w-5 h-5" />
          </button>
          {/* 🔸 Botón Descargar PDF */}
          <button
            onClick={() => {
              // Primero obtener la data completa
              const solicitudCompleta = data?.items.find(
                s => s.idSolicitud === info.row.original.idSolicitud
              );
              
              if (solicitudCompleta) {
                downloadPDF.mutate({
                  solicitud: solicitudCompleta,
                  associate: solicitudCompleta.asociado,
                  fincas: solicitudCompleta.asociado?.fincas || []
                });
              }
            }}
            disabled={downloadPDF.isPending}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#5B732E] border-2 border-[#5B732E] text-white hover:bg-[#556B2F] hover:border-[#556B2F] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Descargar PDF"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Botones Aprobar/Rechazar - solo si está PENDIENTE y no es read-only */}
          {info.row.original.estado === "PENDIENTE" && !isReadOnly && (
            <>
              <button
                onClick={() => approve.mutate(info.row.original.idSolicitud)}
                disabled={approve.isPending}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                title="Aprobar solicitud"
                aria-label="Aprobar solicitud"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => setRejectId(info.row.original.idSolicitud)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                title="Rechazar solicitud"
                aria-label="Rechazar solicitud"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <KPICard label="Total Solicitudes" value={data?.total ?? 0} tone="base" />
          <KPICard label="Página Actual" value={`${data?.page ?? 1} / ${data?.pages ?? 1}`} tone="alt" />
          <KPICard label="Estado" value={status || "Todos"} tone="gold" />
        </div>

        {/* Filtros */}
        <div className="rounded-2xl bg-[#F8F9F3] p-5 shadow-sm mb-6">
          <div className="text-sm font-bold text-[#33361D] mb-4">Filtros</div>
          
          <div className="mb-4">
            <input
              placeholder="Buscar por cédula, nombre, email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["PENDIENTE", "APROBADO", "RECHAZADO"].map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s as any); setPage(1); }}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  status === s
                    ? "bg-[#5B732E] text-white shadow-sm"
                    : "border-2 border-[#EAEFE0] text-[#33361D] hover:bg-[#EAEFE0]"
                }`}
              >
                {s}
              </button>
            ))}
            <button
              onClick={() => { setStatus(undefined); setPage(1); }}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                !status
                  ? "bg-[#5B732E] text-white shadow-sm"
                  : "border-2 border-[#EAEFE0] text-[#33361D] hover:bg-[#EAEFE0]"
              }`}
            >
              Todos
            </button>
          </div>
        </div>

        {/* Tabla */}
        {isLoading ? (
          <div className="rounded-2xl bg-[#F8F9F3] p-8 text-center text-[#556B2F] font-medium">
            Cargando...
          </div>
        ) : (
          <>
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
                            className="px-4 py-3 text-sm font-bold text-[#33361D]"
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

            {/* Paginación */}
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-[#556B2F] font-medium">
                {data?.total ?? 0} resultados — página {data?.page ?? 1} de {data?.pages ?? 1}
              </span>
              <div className="flex gap-3">
                <button
                  className="px-6 py-3 rounded-xl border-2 border-[#5B732E] text-[#5B732E] font-semibold hover:bg-[#EAEFE0] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </button>
                <button
                  className="px-6 py-3 rounded-xl bg-[#5B732E] text-white font-semibold hover:bg-[#556B2F] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  disabled={(data?.pages ?? 1) <= page}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}

        <RejectDialog
          open={rejectId != null}
          onClose={() => setRejectId(null)}
          onConfirm={async (motivo) => {
            if (rejectId) await reject.mutateAsync({ id: rejectId, motivo });
            setRejectId(null);
          }}
        />

        <SolicitudViewModal
          open={viewId != null}
          onClose={() => setViewId(null)}
          solicitud={viewDetail ?? null}
          isLoading={isLoadingDetail}
        />
      </div>
    </div>
  );
}