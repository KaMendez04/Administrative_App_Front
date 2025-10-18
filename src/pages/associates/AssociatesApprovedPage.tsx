import { useState } from "react";
import { useUpdateAssociate } from "../../hooks/associates/useUpdateAssociate";
import { AssociateEditDrawer } from "../../components/associates/AssociateEditDrawer";
import { AssociateViewModal } from "../../components/associates/AssociateViewModal";
import { useAdminAssociatesList } from "../../hooks/associates/useAdminAssociateList";
import { useAssociateDetail } from "../../hooks/associates/useAdminAssociateDetail";
import { getCurrentUser } from "../../services/auth";
import { AssociatesTable, type AssociateRow } from "../../components/associates/associatesTable";
import { StatusFilters } from "../../components/StatusFilters";

function KPICard({
  label,
  value,
  tone = "base",
}: {
  label: string;
  value: string | number;
  tone?: "base" | "alt" | "gold";
}) {
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

type EstadoFilter = "ACTIVO" | "INACTIVO" | undefined;

export default function AssociatesApprovedPage() {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>("ACTIVO");
  const limit = 20;

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
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <KPICard label="Total Asociados" value={data?.total ?? 0} tone="base" />
          <KPICard
            label="Página Actual"
            value={`${data?.page ?? 1} / ${data?.pages ?? 1}`}
            tone="alt"
          />
          <KPICard 
            label="Estado" 
            value={estadoFilter === "ACTIVO" ? "Activo" : estadoFilter === "INACTIVO" ? "Inactivo" : "Todos"} 
            tone="gold" 
          />
        </div>

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

        {/* Tabla */}
        <AssociatesTable
          data={tableData}
          isLoading={isLoading}
          isReadOnly={isReadOnly}
          onView={(id) => setViewId(id)}
          onEdit={(id) => setEditId(id)}
        />

        {/* Paginación */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-[#556B2F] font-medium">
            {data?.total ?? 0} resultados — página {data?.page ?? 1} de{" "}
            {data?.pages ?? 1}
          </span>
          <div className="flex gap-3">
            <button
              className="px-3 py-1 rounded-xl border-2 border-[#5B732E] text-[#5B732E] font-semibold hover:bg-[#EAEFE0] transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>
            <button
              className="px-3 py-1 rounded-xl bg-[#5B732E] text-white font-semibold hover:bg-[#556B2F] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled={(data?.pages ?? 1) <= page}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>

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