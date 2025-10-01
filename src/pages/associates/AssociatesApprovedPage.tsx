import { useState } from "react";
import { useAdminAssociatesList } from "../../hooks/associates/useAssociatesList";
import { useUpdateAssociate } from "../../hooks/associates/useUpdateAssociate";
import { useAdminAssociateDetail } from "../../hooks/associates/useAdminAssociateDetail";
import { AssociateEditDrawer } from "../../components/associates/AssociateEditDrawer";
import { AssociateViewModal } from "../../components/associates/AssociateViewModal";

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

export default function AssociatesApprovedPage() {
  const [status] = useState<"APROBADO">("APROBADO");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useAdminAssociatesList({ status, search, page, limit, sort: "createdAt:desc" });

  const [editId, setEditId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);
  const editDetail = useAdminAssociateDetail(editId ?? 0);
  const viewDetail = useAdminAssociateDetail(viewId ?? 0);
  const update = useUpdateAssociate();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <KPICard label="Total Asociados" value={data?.total ?? 0} tone="base" />
          <KPICard label="Página Actual" value={`${data?.page ?? 1} / ${data?.pages ?? 1}`} tone="alt" />
          <KPICard label="Estado" value="Aprobados" tone="gold" />
        </div>

        <div className="rounded-2xl bg-[#F8F9F3] p-5 shadow-sm mb-6">
          <div className="text-sm font-bold text-[#33361D] mb-4">Búsqueda</div>
          
          <input
            placeholder="Buscar por cédula, nombre, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
          />
        </div>

        {isLoading ? (
          <div className="rounded-2xl bg-[#F8F9F3] p-8 text-center text-[#556B2F] font-medium">
            Cargando...
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-[#F8F9F3] overflow-hidden shadow-sm">
              <div className="bg-[#EAEFE0] px-4 py-3">
                <div className="grid grid-cols-7 gap-4 text-sm font-bold text-[#33361D]">
                  <div>Cédula</div>
                  <div>Nombre</div>
                  <div>Teléfono</div>
                  <div>Email</div>
                  <div>Marca Ganado</div>
                  <div>Fecha</div>
                  <div className="text-right">Acciones</div>
                </div>
              </div>
              <div className="bg-white">
                {(data?.items ?? []).map((r) => (
                  <div
                    key={r.id}
                    className="grid grid-cols-7 gap-4 px-4 py-3 text-sm text-[#33361D] hover:bg-[#F8F9F3] transition"
                  >
                    <div className="font-medium">{r.cedula}</div>
                    <div className="font-medium">{`${r.nombre} ${r.apellido1} ${r.apellido2}`}</div>
                    <div>{r.telefono}</div>
                    <div className="truncate">{r.email}</div>
                    <div className="font-medium">{r.marcaGanado || "—"}</div>
                    <div>{new Date(r.createdAt).toLocaleDateString("es-CR")}</div>
                    <div className="text-right flex gap-2 justify-end">
                      <button
                        onClick={() => setViewId(r.id)}
                        className="px-3 py-1 rounded-lg border-2 border-[#5B732E] text-[#5B732E] font-semibold hover:bg-[#EAEFE0] transition text-xs"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => setEditId(r.id)}
                        className="px-3 py-1 rounded-lg bg-[#C19A3D] text-white font-semibold hover:bg-[#C6A14B] transition text-xs"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
                {(data?.items ?? []).length === 0 && (
                  <div className="py-8 text-center text-gray-400 font-medium">
                    Sin resultados
                  </div>
                )}
              </div>
            </div>

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

        <AssociateViewModal
          open={viewId != null}
          onClose={() => setViewId(null)}
          associate={viewDetail.data ?? null}
        />

        {editId != null && editDetail.data && (
          <AssociateEditDrawer
            open={true}
            onClose={() => setEditId(null)}
            initial={{
              telefono: editDetail.data.telefono,
              email: editDetail.data.email,
              direccion: editDetail.data.direccion ?? "",
              marcaGanado: editDetail.data.marcaGanado ?? "",
              CVO: editDetail.data.CVO ?? "",
              nombreCompleto: `${editDetail.data.nombre} ${editDetail.data.apellido1} ${editDetail.data.apellido2}`,
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