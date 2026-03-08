import React from "react"
import { Coins, Plus, X } from "lucide-react"
import { useForm, type Updater } from "@tanstack/react-form"
import { AssignExtraordinarySchema } from "../../../schemas/extraordinarySchema"
import {
  useAssignExtraordinary,
  useDepartmentsE,
  useExtraordinaryList,
} from "../../../hooks/Budget/extraordinary/useExtraordinary"
import { CustomSelect } from "../../CustomSelect"
import { Input } from "@/components/ui/input"
import { ActionButtons } from "../../ActionButtons"
import { BirthDatePicker } from "@/components/ui/birthDayPicker"
import { parseCR, useMoneyInput } from "@/hooks/Budget/useMoneyInput"

type Props = {
  className?: string
  onAssigned?: (payload: any) => void
  defaultOpen?: boolean
}

export default function AssignExtraordinaryCard({
  className,
  onAssigned,
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = React.useState<boolean>(defaultOpen)
  const [saldoInsuficiente, setSaldoInsuficiente] = React.useState(false)
  const money = useMoneyInput("")
  const { data: extras, loading: loadingExtras } = useExtraordinaryList()
  const { data: departments, loading: loadingDepts } = useDepartmentsE()
  const { submit: assign, loading: assigning } = useAssignExtraordinary()

  const form = useForm({
    defaultValues: {
      extraordinaryId: 0,
      amount: "",
      departmentId: 0,
      subTypeName: "",
      date: "", // ✅ opcional
    },
    onSubmit: async ({ value }) => {
      const parsed = AssignExtraordinarySchema.safeParse(value)
      if (!parsed.success) return

      // recalcular saldo dentro del submit
      const amountNumber = parseCR(parsed.data.amount)
      const selectedExtra = extras.find((e) => e.id === parsed.data.extraordinaryId)
      const remainingNow = selectedExtra
        ? Math.max(0, Number(selectedExtra.amount) - Number(selectedExtra.used))
        : 0

      if (
        parsed.data.extraordinaryId > 0 &&
        Number.isFinite(amountNumber) &&
        amountNumber > remainingNow
      ) {
        setSaldoInsuficiente(true)
        return
      }
      setSaldoInsuficiente(false)

      try {
        const payload = await assign({
          extraordinaryId: parsed.data.extraordinaryId,
          amount: amountNumber,
          departmentId: parsed.data.departmentId,
          subTypeName: parsed.data.subTypeName.trim(),
          date: parsed.data.date || undefined,
        })

        form.reset() // ✅
        onAssigned?.(payload)
      } catch (error) {
        console.error("Error assigning extraordinary:", error)
      }
    },
  })

  const Form = form
  const loading = loadingExtras || loadingDepts || assigning

  const remaining = (() => {
    const x = extras.find((e) => e.id === Form.state.values.extraordinaryId)
    if (!x) return 0
    return Math.max(0, Number(x.amount) - Number(x.used))
  })()

  const extraordinaryOptions = React.useMemo(() => {
    return [
      { value: 0, label: "Seleccione…" },
      ...extras.map((x) => {
        const saldo = Math.max(0, Number(x.amount) - Number(x.used))
        return {
          value: x.id,
          label: `${x.name} — saldo ₡${saldo.toLocaleString("es-CR", {
            minimumFractionDigits: 2,
          })}`,
        }
      }),
    ]
  }, [extras])

  const departmentOptions = React.useMemo(() => {
    return [
      { value: 0, label: "Seleccione…" },
      ...departments.map((d) => ({ value: d.id, label: d.name })),
    ]
  }, [departments])

  return (
    <div
      className={`relative rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-5 md:p-6 ${className ?? ""}`}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Asignar extraordinario a ingreso
        </h2>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#708C3E] text-white shadow hover:bg-[#5e732f]"
          title={open ? "Ocultar sección" : "Mostrar sección"}
          type="button"
        >
          {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <p className="mt-1 text-sm text-gray-600">
          Selecciona el extraordinario, indica cuánto se usará y a qué ingreso
          se sumará. Si no especificas fecha, se usa la actual.
        </p>
      )}

      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            Form.handleSubmit()
          }}
          className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {/* Extraordinario */}
          <Form.Field
            name="extraordinaryId"
            validators={{
              onChange: ({ value }) =>
                value && value > 0 ? undefined : "Seleccione el extraordinario",
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Movimiento Extraordinario
                </label>

                <CustomSelect
                  value={field.state.value}
                  onChange={(v) => {
                    field.handleChange(v ? Number(v) : 0)
                    setSaldoInsuficiente(false)
                  }}
                  options={extraordinaryOptions}
                  placeholder="Seleccione…"
                  disabled={loading}
                  zIndex={30}
                />

                <p className="mt-1 text-xs text-gray-500">
                  Saldo disponible:{" "}
                  <span className="font-medium">
                    ₡{remaining.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
                  </span>
                </p>

                {field.state.meta.errors?.[0] && (
                  <p className="mt-1 text-xs text-[#9c1414]">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </Form.Field>

          {/* Monto (shadcn Input) */}
          <Form.Field
            name="amount"
            validators={{
              onChange: ({ value }) => {
                const ok = AssignExtraordinarySchema.shape.amount.safeParse(value).success
                return ok ? undefined : "Monto inválido (ej: 70 000,90)"
              },
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Monto a asignar
                </label>

                <div className="relative">
                  <Coins className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 select-none text-gray-500">
                    ₡
                  </span>

                  <Input
                    inputMode="decimal"
                    value={money.value}
                    onChange={(e) => {
                      const formatted = money.handleValue(e.target.value)
                      field.handleChange(formatted)
                      setSaldoInsuficiente(false)
                    }}
                    className="border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0 pl-12"
                    disabled={loading}
                  />
                </div>

                {field.state.meta.errors?.[0] && (
                  <p className="mt-1 text-xs text-[#9c1414]">{field.state.meta.errors[0]}</p>
                )}

                {saldoInsuficiente && (
                  <p className="mt-1 text-xs text-[#9c1414]">
                    Saldo insuficiente, por favor ingrese un monto válido
                  </p>
                )}

                <p className="text-xs text-gray-600 mt-1">Ejemplo: 70 000,90</p>
              </div>
            )}
          </Form.Field>

          {/* Departamento */}
          <Form.Field
            name="departmentId"
            validators={{
              onChange: ({ value }) =>
                value && value > 0 ? undefined : "Seleccione el departamento",
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Departamento
                </label>

                <CustomSelect
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v ? Number(v) : 0)}
                  options={departmentOptions}
                  placeholder="Seleccione…"
                  disabled={loading}
                  zIndex={20}
                />

                {field.state.meta.errors?.[0] && (
                  <p className="mt-1 text-xs text-[#9c1414]">{field.state.meta.errors[0]}</p>
                )}
                <p className="text-xs text-gray-600 mt-1">Ejemplo: Donación, Rifa benéfica…</p>
              </div>
            )}
          </Form.Field>

          <Form.Field
            name="subTypeName"
            validators={{
              onChange: ({ value }) =>
                AssignExtraordinarySchema.shape.subTypeName.safeParse(value).success
                  ? undefined
                  : "Texto inválido (3–50)",
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Subtipo (Razón)
                </label>

                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value.slice(0, 50))}
                  className="border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
                  disabled={loading}
                />

                {field.state.meta.errors?.[0] && (
                  <p className="mt-1 text-xs text-[#9c1414]">{field.state.meta.errors[0]}</p>
                )}
                <p className="text-xs text-gray-600 mt-1">Ejemplo: Donación, Rifa benéfica…</p>
              </div>
            )}
          </Form.Field>

          {/* Fecha (tu calendario) */}
          <Form.Field
            name="date"
            validators={{
              onChange: ({ value }) =>
                !value || /^\d{4}-\d{2}-\d{2}$/.test(value) ? undefined : "Fecha inválida",
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Fecha (Opcional)
                </label>

                <div className="space-y-2">
                  <BirthDatePicker
                    value={field.state.value || ""}
                    onChange={(iso: Updater<string>) => field.handleChange(iso)}
                    placeholder="Seleccione una fecha"
                    disabled={loading}
                    error={field.state.meta.errors?.[0] ? String(field.state.meta.errors[0]) : undefined}
                    className="w-full"
                  />
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Si no la eliges, se usa la fecha actual.
                </p>
              </div>
            )}
          </Form.Field>

          {/* Botones usando ActionButtons */}
          <div className="md:col-span-2 flex justify-end pt-2">
            <Form.Subscribe selector={(s) => ({ canSubmit: s.canSubmit })}>
              {({ canSubmit }) => (
                <ActionButtons
                  onCancel={() => {
                    Form.reset()
                    setSaldoInsuficiente(false)
                  }}
                  showCancel
                  cancelText="Cancelar"
                  requireConfirmCancel={false}
                  onSave={() => { }}
                  showSave
                  showText
                  saveButtonType="submit"
                  isSaving={assigning}
                  saveText={assigning ? "Asignando…" : "Asignar a Ingreso"}
                  disabled={loading || !canSubmit}
                />
              )}
            </Form.Subscribe>
          </div>
        </form>
      )}
    </div>
  )
}