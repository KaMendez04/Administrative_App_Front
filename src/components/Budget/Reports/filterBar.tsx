import type { Department } from "../../../models/Budget/incomeProjectionType";
import type { IncomeSubType, IncomeType } from "../../../models/Budget/IncomeType";

  
  // Normalizador defensivo (por si llegan objetos {data:[]} u otros)
  function asArray<T>(x: any): T[] {
    if (Array.isArray(x)) return x as T[];
    if (x && Array.isArray(x.data)) return x.data as T[];
    if (x && Array.isArray(x.items)) return x.items as T[];
    return [];
  }
  
  type Props = {
    // valores
    start?: string;
    end?: string;
    departmentId?: number;
    incomeTypeId?: number;
    incomeSubTypeId?: number;
    // setters
    setStart: (v?: string) => void;
    setEnd: (v?: string) => void;
    setDepartmentId: (v?: number) => void;
    setIncomeTypeId: (v?: number) => void;
    setIncomeSubTypeId: (v?: number) => void;
    // catálogos
    departments: Department[] | any;
    incomeTypes: IncomeType[] | any;
    incomeSubTypes: IncomeSubType[] | any;
    // acción
    onApply: () => void;
  };
  
  export default function FiltersBar({
    start, end, departmentId, incomeTypeId, incomeSubTypeId,
    setStart, setEnd, setDepartmentId, setIncomeTypeId, setIncomeSubTypeId,
    departments, incomeTypes, incomeSubTypes,
    onApply,
  }: Props) {
    const dpts = asArray<Department>(departments);
    const types = asArray<IncomeType>(incomeTypes);
    const subts = asArray<IncomeSubType>(incomeSubTypes);
  
    return (
      <>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="text-sm text-gray-600">Desde</label>
            <input
              type="date"
              value={start ?? ""}
              onChange={(e) => setStart(e.target.value || undefined)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Hasta</label>
            <input
              type="date"
              value={end ?? ""}
              onChange={(e) => setEnd(e.target.value || undefined)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Departamento (nombre)</label>
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={departmentId ?? ""}
              onChange={(e) =>
                setDepartmentId(e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">Opcional</option>
              {dpts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Tipo ingreso (nombre)</label>
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={incomeTypeId ?? ""}
              onChange={(e) =>
                setIncomeTypeId(e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">Opcional</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Subtipo ingreso (nombre)</label>
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={incomeSubTypeId ?? ""}
              onChange={(e) =>
                setIncomeSubTypeId(e.target.value ? Number(e.target.value) : undefined)
              }
              disabled={!incomeTypeId}
            >
              <option value="">Opcional</option>
              {subts.map((s) => (
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
  