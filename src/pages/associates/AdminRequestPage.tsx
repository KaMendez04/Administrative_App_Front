import { useState } from "react";
import { useAdminSolicitudesList } from "../../hooks/associates/useAdminSolicitudesList";
import { useAdminSolicitudDetail } from "../../hooks/associates/useAdminSolicitudDetail";
import { useApproveSolicitud } from "../../hooks/associates/useApproveSolicitud";
import { useRejectSolicitud } from "../../hooks/associates/useRejectSolicitud";
import { RejectDialog } from "../../components/associates/RejectDialog";
import { SolicitudViewModal } from "../../components/associates/SolicitudViewModal";
import { getCurrentUser } from "../../services/auth";
import { RequestsTable } from "../../components/associates/RequestTable";
import { StatusFilters } from "../../components/StatusFilters";
import { KPICard } from "../../components/KPICard";
import { ActionButtons } from "../../components/ActionButtons";

export default function AdminRequestsPage() {
  const [status, setStatus] = useState<"PENDIENTE" | "APROBADO" | "RECHAZADO" | undefined>("PENDIENTE");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const [approvingId, setApprovingId] = useState<number | null>(null);
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
        {/* Filtros y KPIs lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-1">
          {/* Filtros a la izquierda */}
          <StatusFilters
            status={status}
            onStatusChange={(newStatus) => {
              setStatus(newStatus as any);
              setPage(1);
            }}
            search={search}
            onSearchChange={(newSearch) => {
              setSearch(newSearch);
              setPage(1);
            }}
          />

          {/* KPIs a la derecha en columna */}
          <div className="flex flex-col gap-2">
            <KPICard
              label="Total Solicitudes"
              value={data?.total ?? 0}
              tone="base"
            />
            <KPICard label="Estado" value={status || "Todos"} tone="gold" />
          </div>
        </div>

        {/* Tabla de Solicitudes */}
        <RequestsTable
          data={data?.items ?? []}
          isLoading={isLoading}
          isReadOnly={isReadOnly}
          onView={setViewId}
          onApprove={async (id) => {
            setApprovingId(id);
            try {
              await approve.mutateAsync(id);
            } finally {
              setApprovingId(null);
            }
          }}
          onReject={setRejectId}
          approvingId={approvingId}
        />

        {/* Paginación con ActionButtons */}
        {!isLoading && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-[#556B2F] font-medium">
              {data?.total ?? 0} resultados — página {data?.page ?? 1} de{" "}
              {data?.pages ?? 1}
            </span>
            
            <ActionButtons
              showPrevious
              showNext
              showText
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
              disablePrevious={page <= 1}
              disableNext={(data?.pages ?? 1) <= page}
              previousText="Anterior"
              nextText="Siguiente"
            />
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