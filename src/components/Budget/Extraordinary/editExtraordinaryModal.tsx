import { useEffect, useMemo } from "react"
import { useForm } from "@tanstack/react-form"

import { initialState, type Extraordinary } from "../../../models/Budget/extraordinary/extraordinaryInterface"
import { ActionButtons } from "../../ActionButtons"
import { showErrorAlertRegister } from "../../../utils/alerts"
import { useExtraordinaryDetailQuery, useUpdateExtraordinary } from "@/hooks/Budget/extraordinary/useExtraordinary"
import { UpdateExtraordinarySchema } from "@/schemas/extraordinarySchema"
import { Input } from "@/components/ui/input"
import { BirthDatePicker } from "@/components/ui/birthDayPicker"
import { formatCR, parseCR } from "@/hooks/Budget/useMoneyInput"
import { useLockBodyScroll } from "@/hooks/modals/useLockBodyScroll"

type Props = {
    extraordinary: Extraordinary
    onClose: () => void
    onSaved?: () => void
}

export default function EditExtraordinaryModal({ extraordinary, onClose, onSaved }: Props) {
    const detail = useExtraordinaryDetailQuery?.(extraordinary.id, true)
    const current = (detail?.data as Extraordinary | undefined) ?? extraordinary
    useLockBodyScroll(true);

    const canEditAmount = current.canEditAmount === true
    const m = useUpdateExtraordinary()

    const label = "block text-[11px] font-semibold text-[#556B2F] uppercase tracking-wide mb-1"
    const errorText = "text-xs text-[#9c1414] mt-1"

    const defaults = useMemo(
        () => ({
            ...initialState,
            name: current.name ?? "",
            date: current.date ?? "",
            amount: formatCR(String(current.amount ?? "").replace(".", ",")),
        }),
        [current.id]
    )

    const form = useForm({
        defaultValues: defaults,

        validators: {
            onChange: ({ value }) => {
                const toValidate = canEditAmount
                    ? value
                    : { ...value, amount: formatCR(String(current.amount ?? "").replace(".", ",")) }

                const parsed = UpdateExtraordinarySchema.safeParse(toValidate)
                if (parsed.success) return undefined

                const flat = parsed.error.flatten().fieldErrors
                return {
                    fields: {
                        name: flat.name?.[0],
                        date: flat.date?.[0],
                        amount: flat.amount?.[0],
                    },
                }
            },
        },

        onSubmit: async ({ value }) => {
            const patch: any = {}

            // name
            const nameClean = value.name.trim().replace(/\s+/g, " ")
            if (nameClean !== (current.name ?? "")) patch.name = nameClean

            // date
            const nextDate = (value.date ?? "").trim()
            const curDate = String(current.date ?? "").trim()
            if (nextDate !== curDate) patch.date = nextDate === "" ? null : nextDate

            // amount
            if (canEditAmount) {
                const nextAmountStr = String(value.amount ?? "").trim()
                const curAmountStr = formatCR(String(current.amount ?? "").replace(".", ","))

                const nextNum = parseCR(nextAmountStr)
                const curNum = parseCR(curAmountStr)

                if (nextNum !== curNum) {
                    patch.amount = nextNum.toFixed(2)
                }
            }

            if (Object.keys(patch).length === 0) {
                await showErrorAlertRegister("No hay cambios para guardar.")
                return
            }

            await m.submit({ id: current.id, patch })
            onSaved?.()
            onClose()
        },
    })

    useEffect(() => {
        form.setFieldValue("name", current.name ?? "")
        form.setFieldValue("date", current.date ?? "")
        form.setFieldValue("amount", formatCR(String(current.amount ?? "").replace(".", ",")))
    }, [current.id])

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#FAF9F5] border border-[#E6E1D6] rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="px-6 py-5 border-b border-[#E6E1D6] bg-white/60">
                    <h2 className="text-xl font-bold text-[#374321]">Editar Movimiento Extraordinario</h2>
                    <p className="text-sm text-[#556B2F] mt-1">{current.name}</p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="px-6 py-6 space-y-6 overflow-y-auto flex-1"
                >
                    {!canEditAmount && (
                        <div className="rounded-xl bg-[#F8F9F3] p-4 border-2 border-[#EAEFE0]">
                            <p className="text-sm text-[#33361D] font-semibold">
                                El monto no se puede editar porque ya existen asignaciones.
                            </p>
                            <p className="text-xs text-gray-600 mt-1">Sí podés corregir el nombre o la fecha.</p>
                        </div>
                    )}

                    <section>
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#556B2F]">
                            Información del movimiento
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Nombre */}
                            <form.Field name="name">
                                {(field) => (
                                    <div className="md:col-span-2">
                                        <label className={label} htmlFor="name">Nombre</label>
                                        <Input
                                            id="name"
                                            value={field.state.value ?? ""}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className="border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
                                            disabled={m.loading}
                                            maxLength={120}
                                        />
                                        {field.state.meta.errors?.[0] ? (
                                            <p className={errorText}>{String(field.state.meta.errors[0])}</p>
                                        ) : null}
                                        <p className="mt-1 text-xs text-gray-500">Ejemplo: Donación Anónima</p>
                                    </div>
                                )}
                            </form.Field>

                            {/* Fecha */}
                            <form.Field name="date">
                                {(field) => (
                                    <div>
                                        <label className={label}>Fecha</label>
                                        <BirthDatePicker
                                            value={field.state.value || ""}
                                            onChange={(iso) => field.handleChange(iso)}
                                            placeholder="Seleccione una fecha"
                                            disabled={m.loading}
                                            error={field.state.meta.errors?.[0] ? String(field.state.meta.errors[0]) : undefined}
                                            className="w-full"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Seleccione una nueva fecha para el movimiento.</p>
                                    </div>
                                )}
                            </form.Field>

                            {/* Monto */}
                            <form.Field
                                name="amount"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!canEditAmount) return undefined
                                        const ok = UpdateExtraordinarySchema.shape.amount.safeParse(value).success
                                        return ok ? undefined : "Monto inválido (ej: 70 000,90)"
                                    },
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <label className={label} htmlFor="amount">Monto</label>
                                        <Input
                                            id="amount"
                                            type="text"
                                            inputMode="decimal"
                                            value={field.state.value ?? ""}
                                            onChange={(e) => field.handleChange(formatCR(e.target.value))}
                                            onBlur={field.handleBlur}
                                            className="border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
                                            disabled={m.loading || !canEditAmount}
                                        />
                                        {canEditAmount && field.state.meta.errors?.[0] ? (
                                            <p className={errorText}>{String(field.state.meta.errors[0])}</p>
                                        ) : null}
                                        <p className="mt-1 text-xs text-gray-500">Ejemplo: 70 000,90</p>
                                    </div>
                                )}
                            </form.Field>
                        </div>
                    </section>

                    <div className="flex justify-end pt-5 border-t border-[#E6E1D6]">
                        <ActionButtons
                            onCancel={onClose}
                            onSave={() => { }}
                            showCancel
                            showSave
                            showText
                            saveButtonType="submit"
                            isSaving={m.loading}
                            requireConfirmCancel={true}
                            cancelConfirmTitle="¿Cancelar?"
                            cancelConfirmText="Los cambios no guardados se perderán."
                            saveText="Guardar cambios"
                            cancelText="Cancelar"
                            disabled={m.loading || form.state.isValid === false}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}