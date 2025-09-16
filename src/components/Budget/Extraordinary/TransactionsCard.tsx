import { useState } from "react";
import { ArrowRightLeft, Plus, X } from "lucide-react";
import { useForm } from "@tanstack/react-form";

import { useIncomeCascade } from "../../../hooks/Budget/extraordinary/useIncomeCascade";
import { useCreateTransfer } from "../../../hooks/Budget/extraordinary/useCreateTransfer";
import { useSpendCascade } from "../../../hooks/Budget/extraordinary/useSpendCascade";
import { TransferSchema } from "../../../schemas/extraordinarySchema";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-4 focus:ring-[#708C3E]/20";
const selectClass = inputClass;

function Select({
  value,
  onChange,
  disabled,
  options,
  placeholder,
}: {
  value: number | "";
  onChange: (v: number | "") => void;
  disabled?: boolean;
  options: { id: number; name: string }[];
  placeholder: string;
}) {
  return (
    <select
      className={selectClass}
      value={value}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
  );
}

export default function TransactionsCard({
  className = "",
  onDone,
}: {
  className?: string;
  onDone?: () => void;
}) {
  const [open, setOpen] = useState(true);

  // cascadas
  const inc = useIncomeCascade();
  const egreso = useSpendCascade();

  const { submit, loading, error } = useCreateTransfer();

  const form = useForm({
    defaultValues: {
      incomeSubTypeId: 0,
      spendSubTypeId: 0,
      amount: "",
      date: "",
      name: "",
      detail: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = TransferSchema.safeParse(value);
      if (!parsed.success) return;

      await submit({
        incomeSubTypeId: parsed.data.incomeSubTypeId,
        spendSubTypeId: parsed.data.spendSubTypeId,
        amount: Number(parsed.data.amount.replace(",", ".")).toFixed(2),
        date: parsed.data.date || undefined,
        name: parsed.data.name || undefined,
        detail: parsed.data.detail || undefined,
      });

      Form.reset();
      onDone?.();
    },
  });

  const Form = form;
  const busy = loading || inc.loading || egreso.loading;

  return (
    <div
      className={`relative rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-5 md:p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Transacciones</h2>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#708C3E] text-white shadow hover:bg-[#5e732f]"
          title={open ? "Ocultar" : "Mostrar"}
        >
          {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      {!open ? null : (
        <>
          <p className="mt-1 text-sm text-gray-600">
            Mueve saldo de un <b>Subtipo de Ingreso</b> hacia un <b>Subtipo de Egreso</b>.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* Ingreso */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-800">De Tipo ingreso</h3>

              <div className="space-y-2.5">
                <Select
                  value={inc.departmentId}
                  onChange={inc.pickDepartment}
                  options={inc.departments}
                  placeholder="Departamento…"
                />
                <Select
                  value={inc.typeId}
                  onChange={inc.pickType}
                  options={inc.types}
                  placeholder="Tipo…"
                  disabled={!inc.departmentId}
                />
                <Select
                  value={inc.subTypeId}
                  onChange={(v) => {
                    inc.pickSub(v);
                    Form.setFieldValue("incomeSubTypeId", v ? Number(v) : 0);
                  }}
                  options={inc.subs}
                  placeholder="Subtipo…"
                  disabled={!inc.typeId}
                />
              </div>
            </div>

            {/* Egreso */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-800">A Tipo egreso</h3>

              <div className="space-y-2.5">
                <select
                  className={selectClass}
                  value={egreso.deptId}
                  onChange={(e) => egreso.setDeptId(e.target.value ? Number(e.target.value) : "")}
                >
                  <option value="">Departamento…</option>
                  {egreso.departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <select
                  className={selectClass}
                  value={egreso.typeId}
                  onChange={(e) => egreso.setTypeId(e.target.value ? Number(e.target.value) : "")}
                  disabled={!egreso.deptId}
                >
                  <option value="">Tipo…</option>
                  {egreso.filteredTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>

                <select
                  className={selectClass}
                  value={egreso.subTypeId}
                  onChange={(e) => {
                    const v = e.target.value ? Number(e.target.value) : "";
                    egreso.setSubTypeId(v);
                    Form.setFieldValue("spendSubTypeId", v ? Number(v) : 0);
                  }}
                  disabled={!egreso.typeId}
                >
                  <option value="">Subtipo…</option>
                  {egreso.subTypes.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Campos del formulario TSF */}
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <Form.Field
              name="amount"
              validators={{
                onChange: ({ value }) =>
                  TransferSchema.shape.amount.safeParse(value).success
                    ? undefined
                    : "Monto inválido (ej: 1000.50)",
              }}
            >
              {(field) => (
                <div>
                  <input
                    className={inputClass}
                    inputMode="decimal"
                    placeholder="Monto"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value.slice(0, 15))}
                  />
                  {field.state.meta.errors[0] && (
                    <p className="mt-1 text-xs text-red-600">{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </Form.Field>

            <Form.Field
              name="date"
              validators={{
                onChange: ({ value }) =>
                  !value || /^\d{4}-\d{2}-\d{2}$/.test(value) ? undefined : "Fecha inválida",
              }}
            >
              {(field) => (
                <div>
                  <input
                    className={inputClass}
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors[0] && (
                    <p className="mt-1 text-xs text-red-600">{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </Form.Field>

            <Form.Field name="name">
              {(field) => (
                <input
                  className={inputClass}
                  placeholder="Nombre (opcional)"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value.slice(0, 60))}
                />
              )}
            </Form.Field>

            <Form.Field name="detail">
              {(field) => (
                <input
                  className={inputClass}
                  placeholder="Detalle (opcional)"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value.slice(0, 100))}
                />
              )}
            </Form.Field>
          </div>

          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

          <div className="mt-4 text-right">
            <Form.Subscribe selector={(s) => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}>
              {({ canSubmit, isSubmitting }) => (
                <button
                  type="button"
                  onClick={() => Form.handleSubmit()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#708C3E] px-4 py-2 text-white shadow hover:bg-[#5e732f] disabled:opacity-60"
                  disabled={busy || !canSubmit || isSubmitting}
                >
                  <ArrowRightLeft className="h-5 w-5" />
                  {isSubmitting ? "Registrando…" : "Registrar transacción"}
                </button>
              )}
            </Form.Subscribe>
          </div>
        </>
      )}
    </div>
  );
}
