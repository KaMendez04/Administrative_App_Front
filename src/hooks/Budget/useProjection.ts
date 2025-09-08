
import { useEffect, useMemo, useState } from "react";
import { getCategoriesForProjection, getOrCreateProjectionByYear, patchCategoryAmount, patchProjectionTotal } from "../../services/Budget/projectionService";
import type { Projection, ProjectionRow } from "../../models/Budget/projectionType";

const colones = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  maximumFractionDigits: 0,
});

// Convierte input "1.900" / "1900" / "₡1,900" → 1900 (number)
const parseAmount = (v: string) => {
  const n = Number(String(v).replace(/\D+/g, ""));
  return isFinite(n) ? n : 0;
};

export function useProjection(initialYear?: number) {
  /** ---- Estado general ---- */
  const [budgetYear, setBudgetYear] = useState<number>(
    initialYear ?? new Date().getFullYear()
  );
  const [rows, setRows] = useState<ProjectionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<number, string>>({});

  const [projection, setProjection] = useState<Projection | null>(null);

  // Carga por año
  useEffect(() => {
    setLoading(true);
    setError(null);

    getOrCreateProjectionByYear(budgetYear)
      .then((proj) => {
        setProjection(proj);
        return getCategoriesForProjection(proj.id).then((cats) => {
          const mapped = cats.map<ProjectionRow>((c) => ({
            category: { id: c.id, name: c.name, description: c.description ?? undefined },
            projection:
              c.category_amount != null
                ? {
                    id: c.id, 
                    categoryId: c.id,
                    year: budgetYear,
                    amount: Number(c.category_amount),
                  }
                : null,
          }));
          setRows(mapped);
        });
      })
      .catch((e) => setError(e?.message ?? "Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [budgetYear]);

  const totalCalculated = useMemo(
    () => rows.reduce((acc, r) => acc + (r.projection?.amount ?? 0), 0),
    [rows]
  );

  useEffect(() => {
    if (!projection) return;
    const backendTotal = Number(projection.total_amount ?? 0);
    if (backendTotal !== totalCalculated) {
      patchProjectionTotal(projection.id, totalCalculated)
        .then((updated) => setProjection(updated))
        .catch((e) =>
          setError(e?.message ?? "No se pudo sincronizar el monto total")
        );
    }
  }, [totalCalculated, projection?.id]);

  /** ---- Edición por fila ---- */
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
    const { category, projection: projRow } = row;
    const amount = parseAmount(editValues[category.id] ?? "");
    if (!projection) return;

    setSavingId(projRow ? projRow.id : "new");

    patchCategoryAmount(projection.id, category.id, amount)
      .then(() => {
        setRows((rs) =>
          rs.map((r) =>
            r.category.id === category.id
              ? {
                  ...r,
                  projection: {
                    id: r.category.id,
                    categoryId: r.category.id,
                    year: budgetYear,
                    amount,
                  },
                }
              : r
          )
        );
      })
      .catch((e) => setError(e?.message ?? "No se pudo guardar"))
      .finally(() => {
        cancelEdit(category.id);
      });
  };

  return {
    // estado
    budgetYear,
    rows,
    loading,
    savingId,
    error,
    editValues,
    projection,
    totalCalculated,

    // helpers
    colones,

    // setters/handlers
    setBudgetYear,
    setEditValues,
    startEdit,
    cancelEdit,
    saveEdit,
  };
}
