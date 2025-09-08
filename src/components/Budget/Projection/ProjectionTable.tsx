
import React from "react";
import { PlusCircle, Pencil, Check, X } from "lucide-react";
import type { ProjectionRow } from "../../../models/Budget/projectionType";


type Props = {
  rows: ProjectionRow[];
  loading: boolean;
  savingId: number | "new" | null;
  editValues: Record<number, string>;
  totalCalculated: number;
  colones: Intl.NumberFormat;

  // handlers provistos por el hook
  startEdit: (categoryId: number, initial?: number) => void;
  cancelEdit: (categoryId: number) => void;
  saveEdit: (row: ProjectionRow) => void;

  // para deshabilitar guardar cuando no haya proyección
  canSave: boolean;
};

export default function ProjectionTable({
  rows,
  loading,
  savingId,
  editValues,
  totalCalculated,
  colones,
  startEdit,
  cancelEdit,
  saveEdit,
  canSave,
}: Props) {
  return (
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
              const { category, projection: projRow } = row;
              const editing = Object.prototype.hasOwnProperty.call(
                editValues,
                category.id
              );
              const inputVal = editValues[category.id] ?? "";
              const isSaving =
                savingId === "new"
                  ? !projRow
                  : projRow
                  ? savingId === projRow.id
                  : false;

              return (
                <tr key={category.id} className="border-b last:border-b-0">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">
                      {category.name}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {editing ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">₡</span>
                        <input
                          inputMode="numeric"
                          value={inputVal}
                          onChange={() =>

                            (row as any) && 
                            (void 0) ||
                            (void 0)
                          }
                          onInput={(e: React.FormEvent<HTMLInputElement>) => {
                            const val = (e.currentTarget.value ?? "") as string;
                            (window as any).__setProjectionEditValues?.((s: Record<number, string>) => ({
                              ...s,
                              [category.id]: val,
                            }));
                          }}
                          className="w-40 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-600 focus:outline-none"
                          placeholder="0"
                          autoFocus
                        />
                      </div>
                    ) : projRow ? (
                      <span className="text-gray-800">
                        {colones.format(projRow.amount)}
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
                            disabled={isSaving || !canSave}
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
                            onClick={() =>
                              startEdit(category.id, projRow?.amount ?? 0)
                            }
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
              <td className="px-6 py-4">Total (suma de partidas)</td>
              <td className="px-6 py-4">{colones.format(totalCalculated)}</td>
              <td className="px-6 py-4" />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
