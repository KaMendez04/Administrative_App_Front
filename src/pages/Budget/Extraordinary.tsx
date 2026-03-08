import { useState } from "react"
import { Plus, X, Coins } from "lucide-react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { BirthDatePicker } from "@/components/ui/birthDayPicker"

import { CreateExtraordinarySchema } from "../../schemas/extraordinarySchema"
import AssignExtraordinaryCard from "../../components/Budget/Extraordinary/assingnExtraordinary"
import {
  useCreateExtraordinaryMutation,
  useExtraordinaryListQuery,
} from "../../hooks/Budget/extraordinary/useExtraordinary"
import ExtraordinayList from "../../components/Budget/Extraordinary/extraordinayList"
import { ActionButtons } from "../../components/ActionButtons"
import { parseCR, useMoneyInput } from "@/hooks/Budget/useMoneyInput"

export default function BudgetExtraordinary() {
  const [openForm, setOpenForm] = useState(true)

  const { data: list = [], isLoading: loading } = useExtraordinaryListQuery()
  const createMutation = useCreateExtraordinaryMutation()
  const money = useMoneyInput("")

  const form = useForm({
    defaultValues: { name: "", amount: "", date: "" },
    onSubmit: async ({ value }) => {
      const nextValue = { ...value, amount: money.value }

      const parsed = CreateExtraordinarySchema.safeParse(nextValue)
      if (!parsed.success) return

      const { name, date } = parsed.data

      const amountNumber = parseCR(parsed.data.amount)

      try {
        await createMutation.mutateAsync({
          name: name.trim(),
          amount: String(amountNumber),
          date: date || undefined,
        })

        form.reset()
        money.setValue("")
      } catch (error) {
        console.error("Error creating extraordinary:", error)
      }
    },
  })

  const Form = form
  const loadingAll = loading || createMutation.isPending

  const errorText = "text-xs text-[#9c1414] mt-1"
  const label = "mb-1 block text-xs font-semibold text-gray-700"

  return (
    <div className="min-h-screen bg-[#f3f8ef] font-sans">
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        <div className="relative rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-5 md:p-6">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Movimientos Extraordinarios
            </h1>

            <button
              onClick={() => setOpenForm((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#708C3E] text-white shadow hover:bg-[#5e732f]"
              title={openForm ? "Ocultar formulario" : "Nuevo movimiento"}
              type="button"
            >
              {openForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </button>
          </div>

          {openForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                Form.handleSubmit()
              }}
            >
              <p className="mt-1 text-sm text-gray-600 mb-4">
                Registra un nuevo movimiento extraordinario. Si no especificas fecha, se usa la actual.
              </p>

              {/* Nombre */}
              <Form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    z
                      .string()
                      .trim()
                      .min(3, "El nombre debe tener al menos 3 caracteres.")
                      .max(100, "El nombre no puede exceder 100 caracteres.")
                      .safeParse(value).success
                      ? undefined
                      : "Nombre inválido",
                }}
              >
                {(field) => (
                  <div>
                    <label className={label}>Movimiento Extraordinario</label>

                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value.slice(0, 100))}
                      className="border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
                      disabled={loadingAll}
                    />

                    {field.state.meta.errors?.[0] ? (
                      <p className={errorText}>{String(field.state.meta.errors[0])}</p>
                    ) : null}

                    <p className="text-xs text-gray-600 mt-1">
                      Ejemplo: Donación, Rifa benéfica…
                    </p>
                  </div>
                )}
              </Form.Field>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                {/* Fecha */}
                <Form.Field
                  name="date"
                  validators={{
                    onChange: ({ value }) =>
                      !value || /^\d{4}-\d{2}-\d{2}$/.test(value)
                        ? undefined
                        : "Fecha inválida",
                  }}
                >
                  {(field) => (
                    <div>
                      <label className={label}>Fecha (Opcional)</label>

                      <BirthDatePicker
                        value={field.state.value || ""}
                        onChange={(iso) => field.handleChange(iso)}
                        placeholder="Seleccione una fecha"
                        disabled={loadingAll}
                        error={
                          field.state.meta.errors?.[0]
                            ? String(field.state.meta.errors[0])
                            : undefined
                        }
                        className="w-full"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Si no la eliges, se usa la fecha actual.
                      </p>
                    </div>
                  )}
                </Form.Field>

                <Form.Field
                  name="amount"
                  validators={{
                    onChange: ({ value }) =>
                      CreateExtraordinarySchema.shape.amount.safeParse(value).success
                        ? undefined
                        : "Monto inválido",
                  }}
                >
                  {(field) => (
                    <div>
                      <label className={label}>Monto</label>

                      <div className="relative">
                        <Coins className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 select-none text-gray-500">
                          ₡
                        </span>

                        <Input
                          inputMode="decimal"
                          value={field.state.value}
                          onChange={(e) => {
                            const formatted = money.handleValue(e.target.value)
                            field.handleChange(formatted)
                          }}
                          className="border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0 pl-12"
                          disabled={loadingAll}
                        />
                      </div>

                      {field.state.meta.errors?.[0] ? (
                        <p className={errorText}>{String(field.state.meta.errors[0])}</p>
                      ) : null}

                      <p className="text-xs text-gray-600 mt-1">Ejemplo: 78 000,50</p>
                    </div>
                  )}
                </Form.Field>
              </div>

              <div className="flex justify-end pt-6">
                <Form.Subscribe selector={(s) => ({ canSubmit: s.canSubmit })}>
                  {({ canSubmit }) => (
                    <ActionButtons
                      onCancel={() => {
                        Form.reset()
                        money.setValue("")
                      }}
                      showCancel
                      cancelText="Cancelar"
                      requireConfirmCancel={false}
                      onSave={() => { }}
                      showSave
                      showText
                      saveButtonType="submit"
                      isSaving={createMutation.isPending}
                      saveText={
                        createMutation.isPending
                          ? "Guardando…"
                          : "Registrar Movimiento Extraordinario"
                      }
                      disabled={loadingAll || !canSubmit}
                    />
                  )}
                </Form.Subscribe>
              </div>
            </form>
          )}
        </div>

        <ExtraordinayList loading={loading} list={list} />

        <AssignExtraordinaryCard className="mt-6" />
      </div>
    </div>
  )
}