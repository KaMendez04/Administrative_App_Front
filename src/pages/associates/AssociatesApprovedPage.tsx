import { useState } from "react";
import { useUpdateAssociate } from "../../hooks/associates/useUpdateAssociate";
import { AssociateEditDrawer } from "../../components/associates/AssociateEditDrawer";
import { AssociateViewModal } from "../../components/associates/AssociateViewModal";
import { useAdminAssociatesList } from "../../hooks/associates/useAdminAssociateList";
import { useAssociateDetail } from "../../hooks/associates/useAdminAssociateDetail";
import { getCurrentUser } from "../../services/auth";
import { AssociatesTable, type AssociateRow } from "../../components/associates/associatesTable";
import { StatusFilters } from "../../components/StatusFilters";
import { KPICard } from "../../components/KPICard";
import { ActionButtons } from "../../components/ActionButtons";
import { useDownloadAssociatesPDF } from "../../hooks/associates/useDownloadAssociatesPDF";
import { Download } from "lucide-react";
type EstadoFilter = "ACTIVO" | "INACTIVO" | undefined;

export default function AssociatesApprovedPage() {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>("ACTIVO");
  const limit = 20;
  const downloadPDF = useDownloadAssociatesPDF();

  const role = getCurrentUser()?.role?.name?.toUpperCase();
  const isReadOnly = role === "JUNTA";

  // Convertir filtro a boolean o undefined para el hook
  const estadoParam =
    estadoFilter === "ACTIVO" ? true :
    estadoFilter === "INACTIVO" ? false :
    undefined;

  const { data, isLoading } = useAdminAssociatesList({
    estado: estadoParam,
    search,
    page,
    limit,
    sort: "createdAt:desc",
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const { data: editDetail } = useAssociateDetail(editId);
  const { data: viewDetail, isLoading: isLoadingDetail } =
    useAssociateDetail(viewId);

  const update = useUpdateAssociate();

  // Transformar datos para la tabla
  const tableData: AssociateRow[] =
    data?.items.map((asociado) => ({
      idAsociado: asociado.idAsociado,
      cedula: asociado.persona.cedula,
      nombreCompleto: `${asociado.persona.nombre} ${asociado.persona.apellido1} ${asociado.persona.apellido2}`,
      telefono: asociado.persona.telefono,
      email: asociado.persona.email,
      marcaGanado: asociado.marcaGanado ?? null,
      estado: asociado.estado,
      createdAt: asociado.createdAt,
    })) ?? [];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* Filtros y KPIs lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-1">
          {/* Filtros */}
          <StatusFilters
            status={estadoFilter}
            onStatusChange={(newStatus) => {
              setEstadoFilter(newStatus as EstadoFilter);
              setPage(1);
            }}
            search={search}
            onSearchChange={(newSearch) => {
              setSearch(newSearch);
              setPage(1);
            }}
            statusOptions={["ACTIVO", "INACTIVO"]}
            showAllOption={true}
          />

          {/* KPIs a la derecha en columna */}
          <div className="flex flex-col gap-2">
            <KPICard
              label="Total Asociados"
              value={data?.total ?? 0}
              tone="base"
            />
            <KPICard label="Estado" value={estadoFilter || "Todos"} tone="gold" />
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
 
        {/* Tabla */}
        <AssociatesTable
          data={tableData}
          isLoading={isLoading}
          isReadOnly={isReadOnly}
          onView={(id) => setViewId(id)}
          onEdit={(id) => setEditId(id)}
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

        {/* Modales */}
        <AssociateViewModal
          open={viewId != null}
          onClose={() => setViewId(null)}
          associate={viewDetail ?? null}
          isLoading={isLoadingDetail}
        />

        {!isReadOnly && editId != null && editDetail && (
          <AssociateEditDrawer
            open={true}
            onClose={() => setEditId(null)}
            initial={{
              telefono: editDetail.persona.telefono,
              email: editDetail.persona.email,
              direccion: editDetail.persona.direccion ?? "",
              marcaGanado: editDetail.marcaGanado ?? "",
              CVO: editDetail.CVO ?? "",
              nombreCompleto: `${editDetail.persona.nombre} ${editDetail.persona.apellido1} ${editDetail.persona.apellido2}`,
              idAsociado: editDetail.idAsociado,
              estado: editDetail.estado,
            }}
            onSave={async (patch) => {
              if (!editId) return;
              await update.mutateAsync({ id: editId, patch });
              setEditId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}