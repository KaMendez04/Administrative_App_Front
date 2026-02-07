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
import { Download } from "lucide-react";
import { useDownloadSolicitudesPDF } from "../../hooks/associates/useDownloadSolicitudesPdfList";
import { showConfirmApproveRejectedAlert } from "@/utils/alerts";
import { ApproveRejectedDialog } from "@/components/volunteers/ApproveRejectedDialog";
import { getPageItems, PaginationBar } from "@/components/ui/pagination";

export default function AdminRequestsPage() {
  const [status, setStatus] = useState<"PENDIENTE" | "APROBADO" | "RECHAZADO" | undefined>("PENDIENTE");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const limit = 10;

  const downloadPDF = useDownloadSolicitudesPDF();
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
  const [approveRejected, setApproveRejected] = useState<{
    id: number;
    motivo?: string;
  } | null>(null);

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

        <button
          onClick={() =>
            downloadPDF.mutate({
              estado: status,        
              search,                  
              sort: "createdAt:desc",  
            })
          }
          disabled={downloadPDF.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B732E] text-white font-semibold hover:bg-[#556B2F] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm mb-6 mt-6 lg:mt-0"
        >
          {downloadPDF.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generando PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Descargar PDF
            </>
          )}
        </button>

        {/* Tabla de Solicitudes */}
        <RequestsTable
          data={data?.items ?? []}
          isLoading={isLoading}
          isReadOnly={isReadOnly}
          onView={setViewId}
          onApprove={async (sol) => {
          if (sol.estado === "RECHAZADO") {
            const ok = await showConfirmApproveRejectedAlert();
            if (!ok) return;

            setApproveRejected({
              id: sol.idSolicitud,
              motivo: (sol as any).motivo ?? undefined, 
            });
            return;
          }

          setApprovingId(sol.idSolicitud);
          try {
            await approve.mutateAsync({ id: sol.idSolicitud });
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
            <PaginationBar
              page={page}
              totalPages={data?.pages ?? 1}
              pageItems={getPageItems(page, data?.pages ?? 1)}
              onPageChange={(p) => setPage(p)}
              className="justify-center"
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

        <ApproveRejectedDialog
          open={approveRejected != null}
          initialMotivo={approveRejected?.motivo ?? ""}
          onClose={() => setApproveRejected(null)}
          onConfirm={async (motivo) => {
            if (!approveRejected) return;

            setApprovingId(approveRejected.id);
            try {
              await approve.mutateAsync({ id: approveRejected.id, motivo });
            } finally {
              setApprovingId(null);
              setApproveRejected(null);
            }
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
