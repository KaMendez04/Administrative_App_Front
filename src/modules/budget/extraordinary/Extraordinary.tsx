import { useState } from "react";
import { Plus, Calendar, Coins, X } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { CreateExtraordinarySchema } from "./schemas/extraordinarySchema";
import { useCreateExtraordinaryMutation, useExtraordinaryListQuery } from "./hooks/useExtraordinary";

import AssignExtraordinaryCard from "./components/assingnExtraordinary";
import ExtraordinayList from "./components/extraordinayList";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-4 focus:ring-[#708C3E]/20";

export default function BudgetExtraordinary() {
  const [openForm, setOpenForm] = useState(true);
  
  // React Query hooks
  const { data: list = [], isLoading: loading } = useExtraordinaryListQuery();
  const createMutation = useCreateExtraordinaryMutation();

  // ===== TanStack Form: Crear extraordinario =====
  const form = useForm({
    defaultValues: { name: "", amount: "", date: "" },
    onSubmit: async ({ value }) => {
      const parsed = CreateExtraordinarySchema.safeParse(value);
      if (!parsed.success) return;

      const { name, amount, date } = parsed.data;
      
      try {
        await createMutation.mutateAsync({
          name: name.trim(),
          amount: amount.trim(),
          date: date || undefined,
        });
        
        Form.reset();
      } catch (error) {
        console.error('Error creating extraordinary:', error);
      }
    },
  });

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
                      : "Texto inválido (3–50)",
                }}
              >
                {(field) => (
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Movimiento Extraordinario
                    </label>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value.slice(0, 50))}
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
                      disabled={!canSubmit || isSubmitting || createMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-xl bg-gray-600 px-4 py-2 font-medium text-white shadow hover:brightness-95 disabled:opacity-60"
                    >
                      <Plus className="h-5 w-5" />
                      {isSubmitting || createMutation.isPending ? "Guardando…" : "Registrar Movimiento Extraordinario"}
                    </button>
                  )}
                </Form.Subscribe>
              </div>
            </form>
          )}
        </div>

        {/* LISTA */}
        <ExtraordinayList loading={loading} list={list} />

        {/* Asignación y Transferencias - Sin props necesarios, React Query maneja todo */}
        <AssignExtraordinaryCard className="mt-6" />
      </div>
    </div>
  );
}