import { useState } from "react";
import { useAdminSolicitudesList } from "../../hooks/associates/useAdminSolicitudesList";
import { useAdminSolicitudDetail } from "../../hooks/associates/useAdminSolicitudDetail";
import { useApproveSolicitud } from "../../hooks/associates/useApproveSolicitud";
import { useRejectSolicitud } from "../../hooks/associates/useRejectSolicitud";
import { RejectDialog } from "../../components/associates/RejectDialog";
import { SolicitudViewModal } from "../../components/associates/SolicitudViewModal";
import { getCurrentUser } from "../../services/auth";
import { RequestsTable } from "../../components/associates/RequestTable";

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
      <div className="text-xs font-bold tracking-wider uppercase opacity-80">
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}

export default function AdminRequestsPage() {
  const [status, setStatus] = useState<"PENDIENTE" | "APROBADO" | "RECHAZADO" | undefined>("PENDIENTE");
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
    sort: "createdAt:desc",
  });

  const approve = useApproveSolicitud();
  const reject = useRejectSolicitud();

  const [rejectId, setRejectId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);
  const { data: viewDetail, isLoading: isLoadingDetail } =
    useAdminSolicitudDetail(viewId ?? 0);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <KPICard label="Total Solicitudes" value={data?.total ?? 0} tone="base" />
          <KPICard
            label="Página Actual"
            value={`${data?.page ?? 1} / ${data?.pages ?? 1}`}
            tone="alt"
          />
          <KPICard label="Estado" value={status || "Todos"} tone="gold" />
        </div>

        {/* Filtros */}
        <div className="rounded-2xl bg-[#F8F9F3] p-5 shadow-sm mb-6">
          <div className="text-sm font-bold text-[#33361D] mb-4">Filtros</div>

          <div className="mb-4">
            <input
              placeholder="Buscar por cédula, nombre, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["PENDIENTE", "APROBADO", "RECHAZADO"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s as any);
                  setPage(1);
                }}
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
              onClick={() => {
                setStatus(undefined);
                setPage(1);
              }}
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

        {/* Tabla de Solicitudes */}
        <RequestsTable
          data={data?.items ?? []}
          isLoading={isLoading}
          isReadOnly={isReadOnly}
          onView={setViewId}
          onApprove={(id) => approve.mutate(id)}
          onReject={setRejectId}
          isApproving={approve.isPending}
        />

        {/* Paginación */}
        {!isLoading && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-[#556B2F] font-medium">
              {data?.total ?? 0} resultados — página {data?.page ?? 1} de{" "}
              {data?.pages ?? 1}
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
        )}

        {/* Diálogos */}
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