import React from "react";
import { Calendar, Coins, ArrowRightLeft, Plus, X } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { AssignExtraordinarySchema } from "../../../schemas/extraordinarySchema";
import { useAssignExtraordinary, useDepartmentsE, useExtraordinaryList } from "../../../hooks/Budget/extraordinary/useExtraordinary";


type Props = { 
  className?: string; 
  onAssigned?: (payload: any) => void; 
  defaultOpen?: boolean;
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-4 focus:ring-[#708C3E]/20";
const selectClass = inputClass;

export default function AssignExtraordinaryCard({
  className,
  onAssigned,
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = React.useState<boolean>(defaultOpen);

  // Usar los hooks de React Query
  const { data: extras, loading: loadingExtras } = useExtraordinaryList();
  const { data: departments, loading: loadingDepts } = useDepartmentsE();
  const { submit: assign, loading: assigning } = useAssignExtraordinary();

  const form = useForm({
    defaultValues: {
      extraordinaryId: 0,
      amount: "",
      departmentId: 0,
      subTypeName: "",
      date: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = AssignExtraordinarySchema.safeParse(value);
      if (!parsed.success) return;

      try {
        const payload = await assign({
          extraordinaryId: parsed.data.extraordinaryId,
          amount: Number(parsed.data.amount.replace(",", ".")),
          departmentId: parsed.data.departmentId,
          subTypeName: parsed.data.subTypeName.trim(),
          date: parsed.data.date || undefined,
        });

        Form.reset();
        // ¡No necesitas llamar reload manualmente! 
        // React Query invalida automáticamente las queries relacionadas
        onAssigned?.(payload);
      } catch (error) {
        console.error('Error assigning extraordinary:', error);
      }
    },
  });

  const Form = form;
  const loading = loadingExtras || loadingDepts || assigning;

  // saldo disponible del extraordinario seleccionado
  const remaining = (() => {
    const x = extras.find((e) => e.id === Form.state.values.extraordinaryId);
    if (!x) return 0;
    const amt = Number(x.amount);
    const used = Number(x.used);
    return Math.max(0, amt - used);
  })();

  return (
    <div
      className={`relative rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-5 md:p-6 ${className ?? ""}`}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Asignar extraordinario a ingreso</h2>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#708C3E] text-white shadow hover:bg-[#5e732f]"
          title={open ? "Ocultar sección" : "Mostrar sección"}
        >
          {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <p className="mt-1 text-sm text-gray-600">
          Selecciona el extraordinario, indica cuánto se usará y a qué ingreso (tipo del
          departamento) se sumará. Si no especificas fecha, se usa la actual.
        </p>
      )}

      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            Form.handleSubmit();
          }}
          className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {/* Extraordinario */}
          <Form.Field
            name="extraordinaryId"
            validators={{
              onChange: ({ value }) => (value && value > 0 ? undefined : "Seleccione el extraordinario"),
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Movimiento Extraordinario
                </label>
                <select
                  className={selectClass}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : 0)}
                  disabled={loading}
                >
                  <option value={0}>Seleccione…</option>
                  {extras.map((x) => {
                    const saldo = Math.max(0, Number(x.amount) - Number(x.used));
                    return (
                      <option key={x.id} value={x.id}>
                        {x.name} — saldo ₡{saldo.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
                      </option>
                    );
                  })}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Saldo disponible:{" "}
                  <span className="font-medium">
                    ₡{remaining.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
                  </span>
                </p>
                {field.state.meta.errors[0] && (
                  <p className="mt-1 text-xs text-red-600">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </Form.Field>

          {/* Monto */}
          <Form.Field
            name="amount"
            validators={{
              onChange: ({ value }) =>
                AssignExtraordinarySchema.shape.amount.safeParse(value).success
                  ? undefined
                  : "Monto inválido (ej: 1000.50)",
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Monto a asignar</label>
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
                    className={`pl-14 ${inputClass}`}
                    disabled={loading}
                  />
                </div>
                {field.state.meta.errors[0] && (
                  <p className="mt-1 text-xs text-red-600">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </Form.Field>

          {/* Departamento */}
          <Form.Field
            name="departmentId"
            validators={{
              onChange: ({ value }) => (value && value > 0 ? undefined : "Seleccione el departamento"),
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Departamento</label>
                <select
                  className={selectClass}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : 0)}
                  disabled={loading}
                >
                  <option value={0}>Seleccione…</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {field.state.meta.errors[0] && (
                  <p className="mt-1 text-xs text-red-600">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </Form.Field>

          {/* Subtipo */}
          <Form.Field
            name="subTypeName"
            validators={{
              onChange: ({ value }) =>
                AssignExtraordinarySchema.shape.subTypeName.safeParse(value).success
                  ? undefined
                  : "Texto demasiado corto",
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Subtipo (razón)
                </label>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value.slice(0, 60))}
                  placeholder="Ej. Donación, Rifa benéfica…"
                  className={inputClass}
                  disabled={loading}
                />
                {field.state.meta.errors[0] && (
                  <p className="mt-1 text-xs text-red-600">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </Form.Field>

          {/* Fecha */}
          <Form.Field
            name="date"
            validators={{
              onChange: ({ value }) =>
                (!value || /^\d{4}-\d{2}-\d{2}$/.test(value)) ? undefined : "Fecha inválida",
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Fecha (opcional)</label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`pl-10 ${inputClass}`}
                    disabled={loading}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Si no la eliges, se usa la fecha actual.</p>
                {field.state.meta.errors[0] && (
                  <p className="mt-1 text-xs text-red-600">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </Form.Field>

          <div className="md:col-span-2 flex justify-end">
            <Form.Subscribe selector={(s) => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}>
              {({ canSubmit, isSubmitting }) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-600 px-4 py-2 font-medium text-white shadow hover:brightness-95 disabled:opacity-60"
                >
                  <ArrowRightLeft className="h-5 w-5" />
                  {isSubmitting ? "Asignando…" : "Asignar a ingreso"}
                </button>
              )}
            </Form.Subscribe>
          </div>
        </form>
      )}
    </div>
  );
}