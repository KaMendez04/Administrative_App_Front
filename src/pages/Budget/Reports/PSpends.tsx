import { useEffect, useMemo, useState } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import apiConfig from "../../../services/apiConfig";


/* ============== Tipos ============== */
type FiltersBase = { start?: string; end?: string; departmentId?: number };
type SpendFilters = FiltersBase & { spendTypeId?: number; spendSubTypeId?: number };

type RowSpend = { spendSubTypeId: number; name: string; real: number; projected: number; difference: number; };
type ReportSpend = { filters: SpendFilters; rows: RowSpend[]; totals: { real: number; projected: number; difference: number } };

type Department = { id: number; name: string };
type SpendType = { id: number; name: string; departmentId?: number };
type SpendSubType = { id: number; name: string; spendTypeId?: number };

/* ============== Utils ============== */
const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 })
    .format(Number.isFinite(n) ? n : 0);

/* ============== API inline ============== */
async function listDepartments(): Promise<Department[]> {
  const { data } = await apiConfig.get<Department[]>("/department");
  return data ?? [];
}
async function listSpendTypes(departmentId?: number): Promise<SpendType[]> {
  const { data } = await apiConfig.get<any[]>("/spend-type");
  let items: SpendType[] = (data ?? []).map((t) => ({
    id: t.id, name: t.name, departmentId: t?.department?.id,
  }));
  if (departmentId) items = items.filter((t) => t.departmentId === departmentId);
  return items;
}
async function listSpendSubTypes(spendTypeId?: number): Promise<SpendSubType[]> {
  const { data } = await apiConfig.get<any[]>("/spend-sub-type", {
    params: spendTypeId ? { spendTypeId } : undefined,
  });
  return (data ?? []).map((s: any) => ({
    id: s.id, name: s.name, spendTypeId: s?.spendType?.id,
  }));
}
async function getSpendReport(params: SpendFilters): Promise<ReportSpend> {
  const { data } = await apiConfig.get<ReportSpend>("/report-proj/spend", { params });
  return data;
}

/* ============== UI ============== */
function TotalsCards({ totals }: { totals: { real: number; projected: number; difference: number } }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow p-5">
        <div className="text-gray-500 text-sm">Total egresos (Reales)</div>
        <div className="mt-2 text-2xl font-bold text-gray-900">{crc(totals.real)}</div>
      </div>
      <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow p-5">
        <div className="text-gray-500 text-sm">Total egresos (Proyectados)</div>
        <div className="mt-2 text-2xl font-bold text-gray-900">{crc(totals.projected)}</div>
      </div>
      <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow p-5">
        <div className="text-gray-500 text-sm">Diferencia (Proj - Real)</div>
        <div className={`mt-2 text-2xl font-bold ${totals.difference >= 0 ? "text-green-600" : "text-red-600"}`}>
          {crc(totals.difference)}
        </div>
      </div>
    </div>
  );
}

function Content() {
  // Filtros base
  const [start, setStart] = useState<string | undefined>();
  const [end, setEnd] = useState<string | undefined>();
  const [departmentId, setDepartmentId] = useState<number | undefined>();

  // Filtros catálogos
  const [spendTypeId, setSpendTypeId] = useState<number | undefined>();
  const [spendSubTypeId, setSpendSubTypeId] = useState<number | undefined>();

  // Catálogos
  const { data: departments = [] } = useQuery({ queryKey: ["departments"], queryFn: listDepartments });
  const { data: spendTypes = [] } = useQuery({
    queryKey: ["spendTypes", departmentId],
    queryFn: () => listSpendTypes(departmentId),
  });
  const { data: spendSubTypes = [] } = useQuery({
    queryKey: ["spendSubTypes", spendTypeId],
    queryFn: () => listSpendSubTypes(spendTypeId),
    enabled: !!spendTypeId,
  });

  // Reset dependientes
  useEffect(() => { setSpendTypeId(undefined); setSpendSubTypeId(undefined); }, [departmentId]);
  useEffect(() => { setSpendSubTypeId(undefined); }, [spendTypeId]);

  const filters: SpendFilters = useMemo(
    () => ({ start, end, departmentId, spendTypeId, spendSubTypeId }),
    [start, end, departmentId, spendTypeId, spendSubTypeId]
  );

  const q = useQuery({ queryKey: ["reportSpend", filters], queryFn: () => getSpendReport(filters) });

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reportes — Proyección de Egresos</h1>

          {/* Filtros */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm text-gray-600">Desde</label>
              <input type="date" value={start ?? ""} onChange={(e) => setStart(e.target.value || undefined)}
                className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Hasta</label>
              <input type="date" value={end ?? ""} onChange={(e) => setEnd(e.target.value || undefined)}
                className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Departamento (nombre)</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2"
                value={departmentId ?? ""} onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : undefined)}>
                <option value="">Opcional</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Tipo egreso (nombre)</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2"
                value={spendTypeId ?? ""} onChange={(e) => setSpendTypeId(e.target.value ? Number(e.target.value) : undefined)}>
                <option value="">Opcional</option>
                {spendTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Subtipo egreso (nombre)</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2"
                value={spendSubTypeId ?? ""} onChange={(e) => setSpendSubTypeId(e.target.value ? Number(e.target.value) : undefined)}
                disabled={!spendTypeId}>
                <option value="">Opcional</option>
                {spendSubTypes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button onClick={() => q.refetch()} className="rounded-xl bg-[#708C3E] px-4 py-2 text-white font-medium hover:opacity-90">
              Aplicar filtros
            </button>
          </div>

          {/* Resultado */}
          <div className="mt-6 space-y-6">
            {q.isLoading ? (
              <div className="rounded-2xl border border-gray-100 p-6 text-gray-500">Cargando reporte…</div>
            ) : (
              <>
                <TotalsCards totals={q.data?.totals ?? { real: 0, projected: 0, difference: 0 }} />
                <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow">
                  <div className="px-6 py-4 text-sm font-medium text-gray-700">Detalle por subtipo</div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="px-6 py-3 text-left">Subtipo de egreso</th>
                          <th className="px-6 py-3 text-right">Real</th>
                          <th className="px-6 py-3 text-right">Proyectado</th>
                          <th className="px-6 py-3 text-right">Diferencia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(q.data?.rows ?? []).length === 0 && (
                          <tr><td className="px-6 py-8 text-center text-gray-400" colSpan={4}>Sin resultados</td></tr>
                        )}
                        {(q.data?.rows ?? []).map((r) => (
                          <tr key={r.spendSubTypeId} className="border-t">
                            <td className="px-6 py-3">{r.name}</td>
                            <td className="px-6 py-3 text-right">{crc(r.real)}</td>
                            <td className="px-6 py-3 text-right">{crc(r.projected)}</td>
                            <td className={`px-6 py-3 text-right ${r.difference >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {crc(r.difference)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Wrapper local (quita si ya tienes uno global) */
const client = new QueryClient();
export default function PSpendProjectionsPage() {
  return (
    <QueryClientProvider client={client}>
      <Content />
    </QueryClientProvider>
  );
}
