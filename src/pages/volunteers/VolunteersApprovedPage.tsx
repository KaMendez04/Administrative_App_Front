import { useState } from "react";
import { useVolunteersApprovedList } from "../../hooks/Volunteers/useVolunteersApprovedList";
import { useVolunteerApprovedDetail } from "../../hooks/Volunteers/useVolunteerApprovedDetail";
import { useToggleVolunteerStatus } from "../../hooks/Volunteers/useToggleVolunteerStatus";
import { VolunteersApprovedTable } from "../../components/volunteers/VolunteersApprovedTable";
import { VolunteerViewModal } from "../../components/volunteers/VolunteerViewModal";
import { Search } from "lucide-react";

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


export default function VolunteersApprovedPage() {
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useVolunteersApprovedList({
    isActive,
    search,
    page,
    limit,
    sort: "createdAt:desc",
  });

  const toggleStatus = useToggleVolunteerStatus();

  const [viewId, setViewId] = useState<number | null>(null);
  const { data: viewDetail, isLoading: isLoadingDetail } =
    useVolunteerApprovedDetail(viewId ?? 0);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* KPIs y Filtros lado a lado */}
<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
  {/* Filtros a la izquierda */}
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <div className="flex flex-row md:flex-row lg:flex-col gap-4">
      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por cédula, nombre o email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#5B732E] focus:outline-none transition"
        />
      </div>

      {/* Filtro por estado */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setIsActive(undefined);
            setPage(1);
          }}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold transition ${
            isActive === undefined
              ? "bg-[#5B732E] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => {
            setIsActive(true);
            setPage(1);
          }}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold transition ${
            isActive === true
              ? "bg-[#5B732E] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => {
            setIsActive(false);
            setPage(1);
          }}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold transition ${
            isActive === false
              ? "bg-[#5B732E] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Inactivos
        </button>
      </div>
    </div>
  </div>

  {/* KPIs a la derecha en columna */}
  <div className="flex flex-col gap-4">
    <KPICard
      label="Total Voluntarios"
      value={data?.total ?? 0}
      tone="base"
    />
    <KPICard
      label="Estado"
      value={
        isActive === undefined
          ? "Todos"
          : isActive
          ? "Activos"
          : "Inactivos"
      }
      tone="gold"
    />
  </div>
</div>
        {/* Tabla */}
        <VolunteersApprovedTable
          data={data?.items ?? []}
          isLoading={isLoading}
          onView={setViewId}
          onToggleStatus={(id) => toggleStatus.mutate(id)}
          isTogglingStatus={toggleStatus.isPending}
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