import { useEffect, useState } from "react";
import { Plus, Calendar, Coins, X } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { useExtraordinary } from "../../hooks/Budget/extraordinary/useExtraordinary";
import type { Extraordinary } from "../../models/Budget/extraordinary/extraordinaryInterface";
import { crc } from "../../utils/crcDateUtil";
import AssignExtraordinaryCard from "./extraordinary/assingnExtraordinary";
import TransactionsCard from "../../components/Budget/Extraordinary/TransactionsCard";
import { CreateExtraordinarySchema } from "../../schemas/extraordinarySchema";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-4 focus:ring-[#708C3E]/20";

export default function BudgetExtraordinary() {
  // lista
  const [list, setList] = useState<Extraordinary[]>([]);
  const [loading, setLoading] = useState(false);

  // acordeón del form
  const [openForm, setOpenForm] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await useExtraordinary.list();
      setList(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ===== TanStack Form: Crear extraordinario =====
  const form = useForm({
    defaultValues: { name: "", amount: "", date: "" },
    onSubmit: async ({ value }) => {
      const parsed = CreateExtraordinarySchema.safeParse(value);
      if (!parsed.success) return;

      const { name, amount, date } = parsed.data;
      await useExtraordinary.create({
        name: name.trim(),
        amount: amount.trim(), // string
        date: date || undefined,
      });

      Form.reset();
      load();
    },
  });

  // Alias en mayúscula para JSX
  const Form = form;

  return (
    <div className="min-h-screen bg-[#F7F8F5] font-sans">
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        {/* Header + Form acordeón (compacto) */}
        <div className="relative rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-5 md:p-6">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Movimientos Extraordinarios</h1>
            <button
              onClick={() => setOpenForm((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#708C3E] text-white shadow hover:bg-[#5e732f]"
              title={openForm ? "Ocultar formulario" : "Nuevo movimiento"}
            >
              {openForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </button>
          </div>

          {openForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                Form.handleSubmit();
              }}
              className="mt-5 space-y-4"
            >
              <Form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    z.string().trim().min(3).max(100).safeParse(value).success
                      ? undefined
                      : "Nombre inválido (3–100)",
                }}
              >
                {(field) => (
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Movimiento Extraordinario
                    </label>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value.slice(0, 100))}
                      placeholder="Ej. Donación, Rifa benéfica…"
                      className={inputClass}
                    />
                    {field.state.meta.errors[0] && (
                      <p className="mt-1 text-xs text-red-600">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              </Form.Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Form.Field
                  name="date"
                  validators={{
                    onChange: ({ value }) =>
                      (!value || /^\d{4}-\d{2}-\d{2}$/.test(value)) ? undefined : "Fecha inválida",
                  }}
                >
                  {(field) => (
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">Fecha</label>
                      <div className="relative">
                        <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={"pl-10 " + inputClass}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-gray-500">
                        Opcional: si no la eliges, se usa la fecha actual.
                      </p>
                      {field.state.meta.errors[0] && (
                        <p className="mt-1 text-xs text-red-600">{field.state.meta.errors[0]}</p>
                      )}
                    </div>
                  )}
                </Form.Field>

                <Form.Field
                  name="amount"
                  validators={{
                    onChange: ({ value }) =>
                      CreateExtraordinarySchema.shape.amount.safeParse(value).success
                        ? undefined
                        : "Monto inválido (ej: 1000.50)",
                  }}
                >
                  {(field) => (
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">Monto</label>
                      <div className="relative">
                        <Coins className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 select-none text-gray-500">
                          ₡
                        </span>
                        <input
                          inputMode="decimal"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value.slice(0, 15))}
                          placeholder="0"
                          className={"pl-14 " + inputClass}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-gray-500">Máx. 15 enteros y 2 decimales</p>
                      {field.state.meta.errors[0] && (
                        <p className="mt-1 text-xs text-red-600">{field.state.meta.errors[0]}</p>
                      )}
                    </div>
                  )}
                </Form.Field>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => Form.reset()}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <Form.Subscribe selector={(s) => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}>
                  {({ canSubmit, isSubmitting }) => (
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="inline-flex items-center gap-2 rounded-xl bg-gray-600 px-4 py-2 font-medium text-white shadow hover:brightness-95 disabled:opacity-60"
                    >
                      <Plus className="h-5 w-5" />
                      {isSubmitting ? "Guardando…" : "Registrar Movimiento Extraordinario"}
                    </button>
                  )}
                </Form.Subscribe>
              </div>
            </form>
          )}
        </div>

        {/* LISTA */}
        <div className="mt-6 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-gray-100">
          <div className="border-b px-5 md:px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">Movimientos registrados</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Cargando…</div>
          ) : list.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No hay registros.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Movimiento
                    </th>
                    <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Fecha
                    </th>
                    <th className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Monto
                    </th>
                    <th className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Usado
                    </th>
                    <th className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Saldo restante
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {list.map((x) => {
                    const amountNum = Number(x.amount);
                    const usedNum = Number(x.used);
                    const remaining = Math.max(0, amountNum - usedNum);
                    return (
                      <tr key={x.id}>
                        <td className="px-5 py-2.5 text-sm text-gray-900">{x.name}</td>
                        <td className="px-5 py-2.5 text-sm text-gray-700">{x.date ?? "—"}</td>
                        <td className="px-5 py-2.5 text-right text-sm font-medium">{crc(amountNum)}</td>
                        <td className="px-5 py-2.5 text-right text-sm font-medium">{crc(usedNum)}</td>
                        <td className="px-5 py-2.5 text-right text-sm font-semibold">{crc(remaining)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Asignación y Transferencias */}
        <AssignExtraordinaryCard className="mt-6" onAssigned={() => load()} />
        <TransactionsCard className="mt-6" onDone={() => {}} />
      </div>
    </div>
  );
}
