import { useEffect, useMemo, useState } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import apiConfig from "../../../services/apiConfig";


/* ============== Tipos ============== */
type FiltersBase = { start?: string; end?: string; departmentId?: number };
type IncomeFilters = FiltersBase & { incomeTypeId?: number; incomeSubTypeId?: number };

type RowIncome = { incomeSubTypeId: number; name: string; real: number; projected: number; difference: number; };
type ReportIncome = { filters: IncomeFilters; rows: RowIncome[]; totals: { real: number; projected: number; difference: number } };

type Department = { id: number; name: string };
type IncomeType = { id: number; name: string; departmentId?: number };
type IncomeSubType = { id: number; name: string; incomeTypeId?: number };

/* ============== Utils ============== */
const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 })
    .format(Number.isFinite(n) ? n : 0);

/* ============== API inline ============== */
async function listDepartments(): Promise<Department[]> {
  const { data } = await apiConfig.get<Department[]>("/department");
  return data ?? [];
}
async function listIncomeTypes(departmentId?: number): Promise<IncomeType[]> {
  const { data } = await apiConfig.get<any[]>("/income-type");
  let items: IncomeType[] = (data ?? []).map((t) => ({
    id: t.id, name: t.name, departmentId: t?.department?.id,
  }));
  if (departmentId) items = items.filter((t) => t.departmentId === departmentId);
  return items;
}
async function listIncomeSubTypes(incomeTypeId?: number): Promise<IncomeSubType[]> {
  const { data } = await apiConfig.get<any[]>("/income-sub-type", {
    params: incomeTypeId ? { incomeTypeId } : undefined,
  });
  return (data ?? []).map((s: any) => ({
    id: s.id, name: s.name, incomeTypeId: s?.incomeType?.id,
  }));
}
async function getIncomeReport(params: IncomeFilters): Promise<ReportIncome> {
  const { data } = await apiConfig.get<ReportIncome>("/report-proj/income", { params });
  return data;
}

/* ============== UI ============== */
function TotalsCards({ totals }: { totals: { real: number; projected: number; difference: number } }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow p-5">
        <div className="text-gray-500 text-sm">Total ingresos (Reales)</div>
        <div className="mt-2 text-2xl font-bold text-gray-900">{crc(totals.real)}</div>
      </div>
      <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow p-5">
        <div className="text-gray-500 text-sm">Total ingresos (Proyectados)</div>
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
  const [incomeTypeId, setIncomeTypeId] = useState<number | undefined>();
  const [incomeSubTypeId, setIncomeSubTypeId] = useState<number | undefined>();

  // Catálogos
  const { data: departments = [] } = useQuery({ queryKey: ["departments"], queryFn: listDepartments });
  const { data: incomeTypes = [] } = useQuery({
    queryKey: ["incomeTypes", departmentId],
    queryFn: () => listIncomeTypes(departmentId),
  });
  const { data: incomeSubTypes = [] } = useQuery({
    queryKey: ["incomeSubTypes", incomeTypeId],
    queryFn: () => listIncomeSubTypes(incomeTypeId),
    enabled: !!incomeTypeId,
  });

  // Reset dependientes
  useEffect(() => { setIncomeTypeId(undefined); setIncomeSubTypeId(undefined); }, [departmentId]);
  useEffect(() => { setIncomeSubTypeId(undefined); }, [incomeTypeId]);

  const filters: IncomeFilters = useMemo(
    () => ({ start, end, departmentId, incomeTypeId, incomeSubTypeId }),
    [start, end, departmentId, incomeTypeId, incomeSubTypeId]
  );

  const q = useQuery({ queryKey: ["reportIncome", filters], queryFn: () => getIncomeReport(filters) });

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reportes — Proyección de Ingresos</h1>

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
              <label className="text-sm text-gray-600">Tipo ingreso (nombre)</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2"
                value={incomeTypeId ?? ""} onChange={(e) => setIncomeTypeId(e.target.value ? Number(e.target.value) : undefined)}>
                <option value="">Opcional</option>
                {incomeTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Subtipo ingreso (nombre)</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2"
                value={incomeSubTypeId ?? ""} onChange={(e) => setIncomeSubTypeId(e.target.value ? Number(e.target.value) : undefined)}
                disabled={!incomeTypeId}>
                <option value="">Opcional</option>
                {incomeSubTypes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                          <th className="px-6 py-3 text-left">Subtipo de ingreso</th>
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
                          <tr key={r.incomeSubTypeId} className="border-t">
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
export default function PIncomeProjectionsPage() {
  return (
    <QueryClientProvider client={client}>
      <Content />
    </QueryClientProvider>
  );
}
