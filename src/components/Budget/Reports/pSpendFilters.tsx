import type { Department, SpendType, SpendSubType } from "../../../models/Budget/reports/pSpend";

type PSpendFiltersProps = {
  filters: {
    start?: string;
    end?: string;
    departmentId?: number;
    spendTypeId?: number;
    spendSubTypeId?: number;
  };
  setters: {
    setStart: (v?: string) => void;
    setEnd: (v?: string) => void;
    setDepartmentId: (v?: number) => void;
    setSpendTypeId: (v?: number) => void;
    setSpendSubTypeId: (v?: number) => void;
  };
  catalogs: {
    departments: Department[];
    spendTypes: SpendType[];
    spendSubTypes: SpendSubType[];
  };
  onApply: () => void;
};

export function PSpendFilters({ 
  filters, 
  setters, 
  catalogs, 
  onApply 
}: PSpendFiltersProps) {
  return (
    <>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="text-sm text-gray-600">Desde</label>
          <input
            type="date"
            value={filters.start ?? ""}
            onChange={(e) => setters.setStart(e.target.value || undefined)}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Hasta</label>
          <input
            type="date"
            value={filters.end ?? ""}
            onChange={(e) => setters.setEnd(e.target.value || undefined)}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Departamento (nombre)</label>
          <select
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={filters.departmentId ?? ""}
            onChange={(e) => setters.setDepartmentId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Opcional</option>
            {catalogs.departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Tipo egreso (nombre)</label>
          <select
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={filters.spendTypeId ?? ""}
            onChange={(e) => setters.setSpendTypeId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Opcional</option>
            {catalogs.spendTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Subtipo egreso (nombre)</label>
          <select
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={filters.spendSubTypeId ?? ""}
            onChange={(e) => setters.setSpendSubTypeId(e.target.value ? Number(e.target.value) : undefined)}
            disabled={!filters.spendTypeId}
          >
            <option value="">Opcional</option>
            {catalogs.spendSubTypes.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={onApply}
          className="rounded-xl bg-[#708C3E] px-4 py-2 text-white font-medium hover:opacity-90"
        >
          Aplicar filtros
        </button>
      </div>
    </>
  );
}