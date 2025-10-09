import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useUpdateAssociate } from "../../hooks/associates/useUpdateAssociate";
import { getAssociate } from "../../services/adminAssociatesService";
import { AssociateEditDrawer } from "../../components/associates/AssociateEditDrawer";
import { AssociateViewModal } from "../../components/associates/AssociateViewModal";
import { useAdminAssociatesList } from "../../hooks/associates/useAdminAssociateList";

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
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useAdminAssociatesList({ 
    estado: true, // ✅ Boolean, no string
    search, 
    page, 
    limit, 
    sort: "createdAt:asc" 
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);
  
  const { data: editDetail } = useQuery({
    queryKey: ["associate", editId],
    queryFn: () => getAssociate(editId!),
    enabled: !!editId,
  });

  const { data: viewDetail } = useQuery({
    queryKey: ["associate", viewId],
    queryFn: () => getAssociate(viewId!),
    enabled: !!viewId,
  });

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
                {(data?.items ?? []).map((asociado) => (
                  <div
                    key={asociado.idAsociado}
                    className="grid grid-cols-7 gap-4 px-4 py-3 text-sm text-[#33361D] hover:bg-[#F8F9F3] transition"
                  >
                    <div className="font-medium">{asociado.persona.cedula}</div>
                    <div className="font-medium">
                      {`${asociado.persona.nombre} ${asociado.persona.apellido1} ${asociado.persona.apellido2}`}
                    </div>
                    <div>{asociado.persona.telefono}</div>
                    <div className="truncate">{asociado.persona.email}</div>
                    <div className="font-medium">{asociado.marcaGanado || "—"}</div>
                    <div>{new Date(asociado.createdAt).toLocaleDateString("es-CR")}</div>
                    <div className="text-right flex gap-2 justify-end">
                      <button
                        onClick={() => setViewId(asociado.idAsociado)}
                        className="px-3 py-1 rounded-lg border-2 border-[#5B732E] text-[#5B732E] font-semibold hover:bg-[#EAEFE0] transition text-xs"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => setEditId(asociado.idAsociado)}
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
          associate={viewDetail ?? null}
        />

        {editId != null && editDetail && (
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