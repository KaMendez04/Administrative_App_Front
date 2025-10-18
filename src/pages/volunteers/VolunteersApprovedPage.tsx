import { useState } from "react";
import { useVolunteersApprovedList } from "../../hooks/Volunteers/useVolunteersApprovedList";
import { useVolunteerApprovedDetail } from "../../hooks/Volunteers/useVolunteerApprovedDetail";
import { VolunteersApprovedTable } from "../../components/volunteers/VolunteersApprovedTable";
import { VolunteerViewModal } from "../../components/volunteers/VolunteerViewModal";
import { StatusFilters } from "../../components/StatusFilters";

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
    <div className={`rounded-2xl ${toneMap[tone]} p-3.5 shadow-sm`}>
      <div className="text-xs font-bold tracking-wider uppercase opacity-80">
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-bold">{value}</div>
    </div>
  );
}

export default function VolunteersApprovedPage() {
  // ✅ Usar string para compatibilidad con StatusFilters
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // ✅ Convertir el status string a boolean para el backend
  const getIsActiveParam = () => {
    if (status === "ACTIVO") return true;
    if (status === "INACTIVO") return false;
    return undefined; // Todos
  };

  const { data, isLoading } = useVolunteersApprovedList({
    isActive: getIsActiveParam(),
    search,
    page,
    limit,
    sort: "createdAt:desc",
  });

  const getEstadoLabel = () => {
    if (status === "ACTIVO") return "Activos";
    if (status === "INACTIVO") return "Inactivos";
    return "Todos";
  };

  const [viewId, setViewId] = useState<number | null>(null);
  const { data: viewDetail, isLoading: isLoadingDetail } =
    useVolunteerApprovedDetail(viewId ?? 0);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* Filtros y KPIs lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-1">
          {/* ✅ Filtros usando el componente genérico */}
          <StatusFilters
            status={status}
            onStatusChange={(newStatus) => {
              setStatus(newStatus);
              setPage(1);
            }}
            search={search}
            onSearchChange={(newSearch) => {
              setSearch(newSearch);
              setPage(1);
            }}
            searchPlaceholder="Buscar por cédula, nombre o email..."
            statusOptions={["ACTIVO", "INACTIVO"]} // ✅ Opciones específicas para voluntarios
            showAllOption={true}
          />

          {/* KPIs a la derecha en columna */}
          <div className="flex flex-col gap-2">
            <KPICard
              label="Total Voluntarios"
              value={data?.total ?? 0}
              tone="base"
            />
            <KPICard label="Estado" value={getEstadoLabel()} tone="gold" />
          </div>
        </div>

        {/* Tabla */}
        <VolunteersApprovedTable
          data={data?.items ?? []}
          isLoading={isLoading}
          onView={setViewId}
          onEdit={(id) => console.log("Edit:", id)}
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

        {/* Modal de visualización */}
        <VolunteerViewModal
          open={viewId != null}
          onClose={() => setViewId(null)}
          solicitud={
            viewDetail
              ? {
                  idSolicitudVoluntariado: 0,
                  tipoSolicitante: "INDIVIDUAL",
                  voluntario: viewDetail,
                  organizacion: null,
                  fechaSolicitud: viewDetail.createdAt,
                  estado: "APROBADO",
                  fechaResolucion: null,
                  motivo: null,
                  createdAt: viewDetail.createdAt,
                  updatedAt: viewDetail.updatedAt,
                }
              : null
          }
          isLoading={isLoadingDetail}
        />
      </div>
    </div>
  );
}