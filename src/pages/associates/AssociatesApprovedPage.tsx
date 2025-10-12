import { useState } from "react";
import { useUpdateAssociate } from "../../hooks/associates/useUpdateAssociate";
import { AssociateEditDrawer } from "../../components/associates/AssociateEditDrawer";
import { AssociateViewModal } from "../../components/associates/AssociateViewModal";
import { useAdminAssociatesList } from "../../hooks/associates/useAdminAssociateList";
import { useAssociateDetail } from "../../hooks/associates/useAdminAssociateDetail";
import { getCurrentUser } from "../../services/auth";
import { AssociatesTable, type AssociateRow } from "../../components/associates/associatesTable";

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

type EstadoFilter = "ACTIVO" | "INACTIVO" | "TODOS";

export default function AssociatesApprovedPage() {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>("TODOS"); // 🔸 NUEVO
  const limit = 20;

  const role = getCurrentUser()?.role?.name?.toUpperCase();
  const isReadOnly = role === "JUNTA";

  // 🔸 Convertir filtro a boolean o undefined para el hook
  const estadoParam = 
    estadoFilter === "ACTIVO" ? true :
    estadoFilter === "INACTIVO" ? false :
    undefined;

  const { data, isLoading } = useAdminAssociatesList({
    estado: estadoParam, // 🔸 Pasar estado al hook
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

  // 🔸 Transformar datos para la tabla
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

  // 🔸 Función para obtener el label del estado
  const getEstadoLabel = () => {
    switch (estadoFilter) {
      case "ACTIVO":
        return "ACTIVO";
      case "INACTIVO":
        return "INACTIVO";
      default:
        return "TODOS";
    }
  };

  // 🔸 Manejar cambio de filtro y resetear página
  const handleEstadoChange = (newEstado: EstadoFilter) => {
    setEstadoFilter(newEstado);
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* 🔸 KPIs con Estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <KPICard label="Total Asociados" value={data?.total ?? 0} tone="base" />
          <KPICard
            label="Página Actual"
            value={`${data?.page ?? 1} / ${data?.pages ?? 1}`}
            tone="alt"
          />
          <KPICard label="Estado" value={getEstadoLabel()} tone="gold" />
        </div>

        {/* 🔸 Filtros */}
        <div className="rounded-2xl bg-[#F8F9F3] p-5 shadow-sm mb-6">
          <div className="text-sm font-bold text-[#33361D] mb-4">Filtros</div>

          {/* Input de búsqueda */}
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

          {/* 🔸 Botones de filtro por estado */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleEstadoChange("ACTIVO")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                estadoFilter === "ACTIVO"
                  ? "bg-[#5B732E] text-white shadow-md"
                  : "bg-white text-[#5B732E] border-2 border-[#EAEFE0] hover:bg-[#F8F9F3]"
              }`}
            >
              ACTIVO
            </button>
            <button
              onClick={() => handleEstadoChange("INACTIVO")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                estadoFilter === "INACTIVO"
                  ? "bg-[#5B732E] text-white shadow-md"
                  : "bg-white text-[#5B732E] border-2 border-[#EAEFE0] hover:bg-[#F8F9F3]"
              }`}
            >
              INACTIVO
            </button>
            <button
              onClick={() => handleEstadoChange("TODOS")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                estadoFilter === "TODOS"
                  ? "bg-[#5B732E] text-white shadow-md"
                  : "bg-white text-[#5B732E] border-2 border-[#EAEFE0] hover:bg-[#F8F9F3]"
              }`}
            >
              TODOS
            </button>
          </div>
        </div>

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