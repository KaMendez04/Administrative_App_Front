import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAdminSolicitudesList } from "../../hooks/associates/useAdminSolicitudesList";
import { useApproveSolicitud } from "../../hooks/associates/useApproveSolicitud";
import { useRejectSolicitud } from "../../hooks/associates/useRejectSolicitud";
import { getSolicitud } from "../../services/adminSolicitudesService";
import { RejectDialog } from "../../components/associates/RejectDialog";
import { SolicitudViewModal } from "../../components/associates/SolicitudViewModal";

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

export default function AdminRequestsPage() {
  const [status, setStatus] = useState<"PENDIENTE"|"APROBADO"|"RECHAZADO"|undefined>("PENDIENTE");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useAdminSolicitudesList({ 
    status, 
    search, 
    page, 
    limit, 
    sort: "createdAt:desc" 
  });
  
  const approve = useApproveSolicitud();
  const reject = useRejectSolicitud();

  const [rejectId, setRejectId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);
  
  const { data: viewDetail } = useQuery({
    queryKey: ["solicitud", viewId],
    queryFn: () => getSolicitud(viewId!),
    enabled: !!viewId,
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <KPICard label="Total Solicitudes" value={data?.total ?? 0} tone="base" />
          <KPICard label="Página Actual" value={`${data?.page ?? 1} / ${data?.pages ?? 1}`} tone="alt" />
          <KPICard label="Estado" value={status || "Todos"} tone="gold" />
        </div>

        <div className="rounded-2xl bg-[#F8F9F3] p-5 shadow-sm mb-6">
          <div className="text-sm font-bold text-[#33361D] mb-4">Filtros</div>
          
          <div className="mb-4">
            <input
              placeholder="Buscar por cédula, nombre, email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["PENDIENTE", "APROBADO", "RECHAZADO"].map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s as any); setPage(1); }}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  status === s
                    ? "bg-[#5B732E] text-white shadow-sm"
                    : "border-2 border-[#EAEFE0] text-[#33361D] hover:bg-[#EAEFE0]"
                }`}
              >
                {s}
              </button>
            ))}
            <button
              onClick={() => { setStatus(undefined); setPage(1); }}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                !status
                  ? "bg-[#5B732E] text-white shadow-sm"
                  : "border-2 border-[#EAEFE0] text-[#33361D] hover:bg-[#EAEFE0]"
              }`}
            >
              Todos
            </button>
          </div>
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
                  <div>Estado</div>
                  <div>Fecha</div>
                  <div className="text-right">Acciones</div>
                </div>
              </div>
              <div className="bg-white">
                {(data?.items ?? []).map((r) => (
                  <div
                    key={r.idSolicitud}
                    className="grid grid-cols-7 gap-4 px-4 py-3 text-sm text-[#33361D] hover:bg-[#F8F9F3] transition"
                  >
                    <div className="font-medium">{r.persona.cedula}</div>
                    <div className="font-medium">{`${r.persona.nombre} ${r.persona.apellido1}`}</div>
                    <div>{r.persona.telefono}</div>
                    <div className="truncate">{r.persona.email}</div>
                    <div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        r.estado === "PENDIENTE" ? "bg-yellow-100 text-yellow-800" :
                        r.estado === "APROBADO" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {r.estado}
                      </span>
                    </div>
                    <div>{new Date(r.createdAt).toLocaleDateString("es-CR")}</div>
                    <div className="text-right flex gap-2 justify-end">
                      <button
                        onClick={() => setViewId(r.idSolicitud)}
                        className="px-3 py-1 rounded-lg border-2 border-[#5B732E] text-[#5B732E] font-semibold hover:bg-[#EAEFE0] transition text-xs"
                      >
                        Ver
                      </button>
                      {r.estado === "PENDIENTE" && (
                        <>
                          <button
                            onClick={() => approve.mutate(r.idSolicitud)}
                            disabled={approve.isPending}
                            className="px-3 py-1 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition text-xs disabled:opacity-50"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => setRejectId(r.idSolicitud)}
                            className="px-3 py-1 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition text-xs"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
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
        />
      </div>
    </div>
  );
}