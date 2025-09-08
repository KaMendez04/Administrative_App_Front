import { useEffect, useMemo, useState } from "react";
import { PlusCircle, Pencil, Check, X } from "lucide-react";

type Category = { id: number; name: string; description?: string };
type ProjectionDTO = { id: number; categoryId: number; year: number; amount: number };
type ProjectionRow = { category: Category; projection?: ProjectionDTO | null };

const colones = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  maximumFractionDigits: 0,
});
const parseAmount = (v: string) => {
  const n = Number(String(v).replace(/\D+/g, ""));
  return isFinite(n) ? n : 0;
};

const memory = {
  categories: [
    { id: 1, name: "Salarios" },
    { id: 2, name: "Limpieza" },
    { id: 3, name: "Mantenimiento" },
    { id: 4, name: "Servicios Públicos" },
  ] as Category[],
  projectionsByYear: new Map<number, ProjectionDTO[]>([
    [
      2025,
      [
        { id: 1, categoryId: 1, year: 2025, amount: 1900 },
        { id: 2, categoryId: 3, year: 2025, amount: 2000 },
      ],
    ],
  ]),
  idCounter: 3,
};

const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));

async function memGetCategories(): Promise<Category[]> {
  await wait();
  return [...memory.categories];
}
async function memGetProjections(year: number): Promise<ProjectionDTO[]> {
  await wait();
  return [...(memory.projectionsByYear.get(year) ?? [])];
}
async function memCreateProjection(p: {
  categoryId: number;
  year: number;
  amount: number;
}): Promise<ProjectionDTO> {
  await wait();
  const created: ProjectionDTO = {
    id: memory.idCounter++,
    categoryId: p.categoryId,
    year: p.year,
    amount: p.amount,
  };
  const list = memory.projectionsByYear.get(p.year) ?? [];
  memory.projectionsByYear.set(p.year, [...list, created]);
  return created;
}
async function memUpdateProjection(id: number, amount: number): Promise<ProjectionDTO> {
  await wait();
  let updated!: ProjectionDTO;
  for (const [year, list] of memory.projectionsByYear) {
    const idx = list.findIndex((x) => x.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], amount };
      updated = { ...list[idx] };
      memory.projectionsByYear.set(year, [...list]);
      break;
    }
  }
  return updated;
}

type Props = { year?: number; title?: string };

export default function ProjectionSection({ year, title = "Proyección" }: Props) {
  const [budgetYear, setBudgetYear] = useState<number>(year ?? new Date().getFullYear());
  const [rows, setRows] = useState<ProjectionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<number, string>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [cats, projs] = await Promise.all([
          memGetCategories(),
          memGetProjections(budgetYear),
        ]);
        if (!alive) return;
        const map = new Map<number, ProjectionDTO>();
        projs.forEach((p) => map.set(p.categoryId, p));
        setRows(cats.map((c) => ({ category: c, projection: map.get(c.id) ?? null })));
      } catch (e: any) {
        setError(e?.message ?? "Error al cargar datos");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [budgetYear]);

  const total = useMemo(
    () => rows.reduce((acc, r) => acc + (r.projection?.amount ?? 0), 0),
    [rows]
  );

  const startEdit = (categoryId: number, initial?: number) =>
    setEditValues((s) => ({ ...s, [categoryId]: (initial ?? 0).toString() }));

  const cancelEdit = (categoryId: number) => {
    setEditValues((s) => {
      const { [categoryId]: _, ...rest } = s;
      return rest;
    });
    setSavingId(null);
  };

  const saveEdit = async (row: ProjectionRow) => {
    const { category, projection } = row;
    const amount = parseAmount(editValues[category.id] ?? "");
    if (amount <= 0) {
      setError("El monto debe ser mayor a cero");
      return;
    }
    try {
      setSavingId(projection ? projection.id : "new");
      const saved = projection
        ? await memUpdateProjection(projection.id, amount)
        : await memCreateProjection({ categoryId: category.id, year: budgetYear, amount });

      setRows((rs) =>
        rs.map((r) => (r.category.id === category.id ? { ...r, projection: saved } : r))
      );
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar");
    } finally {
      cancelEdit(category.id);
    }
  };

  return (
    // Contenedor global ancho y centrado (coherente con el resto de páginas)
    <div className="w-full px-6 lg:px-12 xl:px-20 max-w-7xl mx-auto">
      {/* Card que agrupa título + selector + tabla */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center gap-2">
            <label htmlFor="year" className="text-sm text-gray-600">
              Año
            </label>
            <input
              id="year"
              type="number"
              value={budgetYear}
              onChange={(e) => setBudgetYear(Number(e.target.value))}
              className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <colgroup>
              <col className="w-1/2" />
              <col className="w-1/3" />
              <col className="w-1/6" />
            </colgroup>
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                <th className="px-6 py-4">Partida</th>
                <th className="px-6 py-4">Monto Proyectado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-6 py-6 text-gray-500" colSpan={3}>
                    Cargando…
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const { category, projection } = row;
                  const editing = editValues.hasOwnProperty(category.id);
                  const inputVal = editValues[category.id] ?? "";
                  const isSaving =
                    savingId === "new"
                      ? !projection
                      : projection
                      ? savingId === projection.id
                      : false;

                  return (
                    <tr key={category.id} className="border-b last:border-b-0">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-800">{category.name}</span>
                      </td>

                      <td className="px-6 py-4">
                        {editing ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">₡</span>
                            <input
                              inputMode="numeric"
                              value={inputVal}
                              onChange={(e) =>
                                setEditValues((s) => ({ ...s, [category.id]: e.target.value }))
                              }
                              className="w-40 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-600 focus:outline-none"
                              placeholder="0"
                              autoFocus
                            />
                          </div>
                        ) : projection ? (
                          <span className="text-gray-800">
                            {colones.format(projection.amount)}
                          </span>
                        ) : (
                          <span className="text-gray-400">Sin proyección</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          {editing ? (
                            <>
                              <button
                                title="Guardar"
                                onClick={() => saveEdit(row)}
                                disabled={isSaving}
                                className="rounded-full p-1.5 hover:bg-emerald-50 disabled:opacity-60"
                              >
                                <Check className="h-5 w-5 text-emerald-600" />
                              </button>
                              <button
                                title="Cancelar"
                                onClick={() => cancelEdit(category.id)}
                                disabled={isSaving}
                                className="rounded-full p-1.5 hover:bg-red-50 disabled:opacity-60"
                              >
                                <X className="h-5 w-5 text-red-500" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                title="Añadir proyección"
                                onClick={() => startEdit(category.id, 0)}
                                className="rounded-full p-1.5 hover:bg-gray-100"
                              >
                                <PlusCircle className="h-5 w-5 text-gray-700" />
                              </button>
                              <button
                                title="Editar proyección"
                                onClick={() => startEdit(category.id, projection?.amount ?? 0)}
                                className="rounded-full p-1.5 hover:bg-gray-100"
                              >
                                <Pencil className="h-5 w-5 text-gray-700" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {!loading && (
                <tr className="bg-gray-50 font-medium">
                  <td className="px-6 py-4">Total</td>
                  <td className="px-6 py-4">{colones.format(total)}</td>
                  <td className="px-6 py-4" />
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
