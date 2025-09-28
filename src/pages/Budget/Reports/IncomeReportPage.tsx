import { useMemo, useState } from "react";
import type { IncomeReportFilters } from "../../../models/Budget/reports/income";
import { useIncomeReport } from "../../../hooks/Budget/reports/useIncomeReport";
import IncomeTable from "../../../components/Budget/Reports/IncomeTable";

const todayISO = new Date().toISOString().slice(0, 10);

const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

export default function IncomeReportPage() {
  const [filters, setFilters] = useState<IncomeReportFilters>({
    start: todayISO,
    end: todayISO,
    departmentId: "",
    incomeTypeId: "",
    incomeSubTypeId: "",
  });

  // Normaliza tipos para el hook (IDs como number u undefined)
  const cleanFilters = useMemo<IncomeReportFilters>(
    () => ({
      ...filters,
      departmentId:
        filters.departmentId === "" ? undefined : Number(filters.departmentId),
      incomeTypeId:
        filters.incomeTypeId === "" ? undefined : Number(filters.incomeTypeId),
      incomeSubTypeId:
        filters.incomeSubTypeId === ""
          ? undefined
          : Number(filters.incomeSubTypeId),
    }),
    [filters]
  );

  const { data, isLoading, refetch, isFetching } = useIncomeReport(cleanFilters);

  // Asegura filas como arreglo tipado
  const rows: any[] = Array.isArray(data?.rows) ? (data!.rows as any[]) : [];

  // Totales robustos (usa backend si viene; si no, deriva de filas)
  const totals = useMemo(() => {
    const backend: any = data?.totals ?? {};

    // 1) Total desde filas (fallback)
    const totalFromRows = rows.reduce(
      (acc, r) => acc + Number(r?.amount ?? 0),
      0
    );

    // 2) Fallbacks agrupados
    const deptMap = new Map<string, number>();
    const typeMap = new Map<string, number>();

    for (const r of rows) {
      const dept =
        (typeof r?.department === "string"
          ? r.department
          : r?.department?.name) || "—";
      const typ =
        (typeof r?.incomeType === "string"
          ? r.incomeType
          : r?.incomeType?.name) || "—";
      const amt = Number(r?.amount ?? 0);

      deptMap.set(dept, (deptMap.get(dept) ?? 0) + amt);
      typeMap.set(typ, (typeMap.get(typ) ?? 0) + amt);
    }

    const byDepartmentFallback = Array.from(
      deptMap,
      ([department, total]) => ({ department, total })
    );
    const byTypeFallback = Array.from(typeMap, ([type, total]) => ({
      type,
      total,
    }));

    // 3) Usa summary del back si está presente
    const byDepartmentBackend: any[] = Array.isArray(backend?.byDepartment)
      ? backend.byDepartment
      : [];
    const byTypeBackend: any[] = Array.isArray(backend?.byType)
      ? backend.byType
      : [];

    const byDepartment = byDepartmentBackend.length
      ? byDepartmentBackend.map((x) => ({
          department:
            (typeof x?.department === "string"
              ? x.department
              : x?.department?.name) ||
            x?.departmentName ||
            x?.dept ||
            (typeof x?.name === "string" ? x.name : x?.name?.name) ||
            "—",
          total: Number(x?.total ?? 0),
        }))
      : byDepartmentFallback;

    const byType = byTypeBackend.length
      ? byTypeBackend.map((x) => ({
          type:
            (typeof x?.type === "string" ? x.type : x?.type?.name) ||
            (typeof x?.name === "string" ? x.name : x?.name?.name) ||
            "—",
          total: Number(x?.total ?? 0),
        }))
      : byTypeFallback;

    const total =
      Number(backend?.total) > 0 ? Number(backend.total) : totalFromRows;

    return { total, byDepartment, byType };
  }, [data?.rows, data?.totals, rows]);

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="relative rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">
          <h1 className="text-2xl font-bold mb-6">Reportes — Ingresos</h1>

          {/* Filtros (mismo layout/estilo que Egresos) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Desde</label>
              <input
                type="date"
                className="w-full rounded-xl border border-gray-200 p-2"
                value={filters.start ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, start: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Hasta</label>
              <input
                type="date"
                className="w-full rounded-xl border border-gray-200 p-2"
                value={filters.end ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, end: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Departamento (id)
              </label>
              <input
                type="number"
                placeholder="Opcional"
                className="w-full rounded-xl border border-gray-200 p-2"
                value={(filters.departmentId as any) ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    departmentId: (e.target.value as any) ?? "",
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Tipo ingreso (id)
              </label>
              <input
                type="number"
                placeholder="Opcional"
                className="w-full rounded-xl border border-gray-200 p-2"
                value={(filters.incomeTypeId as any) ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    incomeTypeId: (e.target.value as any) ?? "",
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Subtipo ingreso (id)
              </label>
              <input
                type="number"
                placeholder="Opcional"
                className="w-full rounded-xl border border-gray-200 p-2"
                value={(filters.incomeSubTypeId as any) ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    incomeSubTypeId: (e.target.value as any) ?? "",
                  }))
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => refetch()}
              className="rounded-xl bg-[#708C3E] text-white px-5 py-3 shadow hover:opacity-90 transition disabled:opacity-60"
              disabled={isFetching}
            >
              {isFetching ? "Actualizando…" : "Aplicar filtros"}
            </button>
            <span className="text-sm text-gray-500">
              {(cleanFilters.start as string) || "…"} →{" "}
              {(cleanFilters.end as string) || "…"}
            </span>
          </div>

          {/* Totales (mismo estilo que Egresos) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="text-sm text-gray-500">Total ingresos</div>
              <div className="text-2xl font-semibold">{crc(totals.total ?? 0)}</div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="text-sm text-gray-500">Por departamento</div>
              <ul className="text-sm mt-2 space-y-1">
                {(totals.byDepartment ?? []).map((r: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span>{r.department || "—"}</span>
                    <span className="font-medium">{crc(Number(r.total ?? 0))}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="text-sm text-gray-500">Por tipo</div>
              <ul className="text-sm mt-2 space-y-1">
                {(totals.byType ?? []).map((r: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span>{r.type || "—"}</span>
                    <span className="font-medium">{crc(Number(r.total ?? 0))}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tabla */}
          <div className="mt-10 border-2 border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
            <IncomeTable rows={rows} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
