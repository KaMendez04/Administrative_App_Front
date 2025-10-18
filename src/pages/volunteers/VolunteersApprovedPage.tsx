import { useState, useMemo } from "react";
import { useVolunteersApprovedList } from "../../hooks/Volunteers/individual/useVolunteersApprovedList";
import { useOrganizationsApprovedList } from "../../hooks/Volunteers/organizations/useOrganizationsApprovedList";
import { useOrganizationDetail } from "../../hooks/Volunteers/organizations/useOrganizationDetail";
import { StatusFilters } from "../../components/StatusFilters";
import { getCurrentUser } from "../../services/auth";
import { ApprovedVolunteerViewModal } from "../../components/volunteers/ApprovedVolunteerViewModal";
import { UnifiedVolunteersTable, type UnifiedVolunteerRow } from "../../components/volunteers/UnifiedVolunteersTable";
import { useVolunteerApprovedDetail } from "../../hooks/Volunteers/individual/useVolunteerApprovedDetail";

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
    <div className={`rounded-2xl ${toneMap[tone]} p-3.5 shadow-sm`}>
      <div className="text-xs font-bold tracking-wider uppercase opacity-80">
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-bold">{value}</div>
    </div>
  );
}

type EstadoFilter = "ACTIVO" | "INACTIVO" | undefined;

export default function VolunteersApprovedPage() {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>("ACTIVO");
  const [editId, setEditId] = useState<{ id: number; tipo: "INDIVIDUAL" | "ORGANIZACION" } | null>(null);
  const [viewId, setViewId] = useState<{ id: number; tipo: "INDIVIDUAL" | "ORGANIZACION" } | null>(null);
  const limit = 20;

  const role = getCurrentUser()?.role?.name?.toUpperCase();
  const isReadOnly = role === "JUNTA";

  const isActiveParam =
    estadoFilter === "ACTIVO" ? true :
    estadoFilter === "INACTIVO" ? false :
    undefined;

  // Fetch de ambos tipos
  const { data: volunteersData, isLoading: isLoadingVolunteers } = useVolunteersApprovedList({
    isActive: isActiveParam,
    search,
    page: 1,
    limit: 100,
    sort: "createdAt:desc",
  });

  const { data: organizationsData, isLoading: isLoadingOrganizations } = useOrganizationsApprovedList({
    isActive: isActiveParam,
    search,
    page: 1,
    limit: 100,
    sort: "createdAt:desc",
  });

  // Fetch de detalles según el tipo
  const { data: volunteerDetail, isLoading: isLoadingVolunteerDetail } = useVolunteerApprovedDetail(
    viewId?.tipo === "INDIVIDUAL" ? viewId.id : 0
  );

  const { data: organizationDetail, isLoading: isLoadingOrganizationDetail } = useOrganizationDetail(
    viewId?.tipo === "ORGANIZACION" ? viewId.id : null
  );

  // Combinar y unificar datos
  const unifiedData = useMemo(() => {
    const volunteers: UnifiedVolunteerRow[] = (volunteersData?.items || []).map((v) => ({
      id: v.idVoluntario,
      tipo: "INDIVIDUAL" as const,
      identificacion: v.persona.cedula,
      nombreCompleto: `${v.persona.nombre} ${v.persona.apellido1} ${v.persona.apellido2}`,
      telefono: v.persona.telefono,
      email: v.persona.email,
      estado: v.isActive ?? false,
      original: v,
    }));

    const organizations: UnifiedVolunteerRow[] = (organizationsData?.items || []).map((o) => ({
      id: o.idOrganizacion,
      tipo: "ORGANIZACION" as const,
      identificacion: o.cedulaJuridica,
      nombreCompleto: o.nombre,
      telefono: o.telefono,
      email: o.email,
      estado: o.isActive ?? false,
      original: o,
    }));

    return [...volunteers, ...organizations].sort((a, b) =>
      b.original.createdAt.localeCompare(a.original.createdAt)
    );
  }, [volunteersData, organizationsData]);

  // Paginación local
  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return unifiedData.slice(start, end);
  }, [unifiedData, page, limit]);

  const totalPages = Math.ceil(unifiedData.length / limit);
  const isLoading = isLoadingVolunteers || isLoadingOrganizations;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* Filtros y KPIs lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-1">
          {/* Filtros a la izquierda */}
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
              label="Total Voluntarios"
              value={unifiedData.length}
              tone="base"
            />
            <KPICard
              label="Estado"
              value={
                estadoFilter === "ACTIVO"
                  ? "Activo"
                  : estadoFilter === "INACTIVO"
                  ? "Inactivo"
                  : "Todos"
              }
              tone="gold"
            />
          </div>
        </div>

        {/* Tabla Unificada */}
        <UnifiedVolunteersTable
          data={paginatedData}
          isLoading={isLoading}
          isReadOnly={isReadOnly}
          onView={(id, tipo) => setViewId({ id, tipo })}
          onEdit={(id, tipo) => setEditId({ id, tipo })}
        />

        {/* Paginación */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-[#556B2F] font-medium">
            {unifiedData.length} resultados — página {page} de {totalPages || 1}
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
              disabled={totalPages <= page}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>

        {/* Modal de visualización dinámico */}
        {viewId && viewId.tipo === "INDIVIDUAL" && (
          <ApprovedVolunteerViewModal
            open={true}
            onClose={() => setViewId(null)}
            data={volunteerDetail || null}
            tipo="INDIVIDUAL"
            isLoading={isLoadingVolunteerDetail}
          />
        )}

        {viewId && viewId.tipo === "ORGANIZACION" && (
          <ApprovedVolunteerViewModal
            open={true}
            onClose={() => setViewId(null)}
            data={organizationDetail || null}
            tipo="ORGANIZACION"
            isLoading={isLoadingOrganizationDetail}
          />
        )}

        {/* TODO: Modal de edición */}
      </div>
    </div>
  );
}