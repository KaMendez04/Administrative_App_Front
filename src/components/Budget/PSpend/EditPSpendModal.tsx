// src/components/Budget/PSpend/EditPSpendModal.tsx
import { useEffect, useMemo, useRef, useState } from "react"
import { X } from "lucide-react"
import { createPortal } from "react-dom"
import { CustomSelect } from "../../CustomSelect"
import { parseCR, useMoneyInput } from "../../../hooks/Budget/useMoneyInput"
import { usePSpendSubTypes } from "../../../hooks/Budget/pSpend/usePSpendCatalog"
import { useUpdatePSpend } from "../../../hooks/Budget/pSpend/usePSpendMutation"

type PSpendEditing = {
  id: number
  amount: string
  date?: string
  pSpendTypeId?: number
  subTypeId?: number
}

type Props = {
  open: boolean
  onClose: () => void
  spend: PSpendEditing | null
}

export default function EditPSpendModal({ open, onClose, spend }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // bloqueo scroll
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // money input
  const money = useMoneyInput("")
  const amountStr: string = ((money as any).value ?? "") as string
  const amount = parseCR(amountStr || "") ?? 0

  const [subTypeId, setSubTypeId] = useState<number | "">("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ✅ evitar re-inicializar si React re-renderiza
  const lastLoadedId = useRef<number | null>(null)

  // cargar valores al abrir (solo cuando cambia el id)
  useEffect(() => {
    if (!open || !spend?.id) return

    if (lastLoadedId.current === spend.id) return
    lastLoadedId.current = spend.id

    setErrors({})
    setSubTypeId(typeof spend.subTypeId === "number" ? spend.subTypeId : "")

    if (typeof (money as any).setValue === "function") {
      ;(money as any).setValue(String(spend.amount ?? ""))
    }
  }, [open, spend?.id]) // 👈 importantísimo: NO dependas de `spend` completo

  // subtypes del type actual
  const subTypes = usePSpendSubTypes(
    typeof spend?.pSpendTypeId === "number" ? spend.pSpendTypeId : undefined
  )

  const subTypeOptions = useMemo(
    () => (subTypes.data ?? []).map((s) => ({ label: s.name, value: s.id })),
    [subTypes.data]
  )

  const update = useUpdatePSpend()

  async function onSave() {
    setErrors({})
    if (!spend?.id) return

    if (!subTypeId) {
      return setErrors((e) => ({ ...e, subTypeId: "Selecciona un subtipo" }))
    }
    if (!amountStr || amount <= 0) {
      return setErrors((e) => ({ ...e, amount: "Monto requerido" }))
    }

    try {
      await update.mutate({
        id: spend.id,
        amount,
        subTypeId: Number(subTypeId),
        // si quieres mantener fecha, la mandas. Si no, quítala.
        date: spend.date,
      })
      onClose()
      // resetea para que si abres otro id cargue bien
      lastLoadedId.current = null
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo actualizar" }))
    }
  }

  if (!open || !mounted || !spend) return null

  const ui = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />

      <div className="relative z-[1001] w-full max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b p-4 md:p-5">
          <h2 className="text-lg font-semibold text-gray-900">Editar proyección</h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-600 hover:bg-gray-100" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-4 md:p-6">
          {/* Subtipo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#33361D]">Subtipo</label>
            <CustomSelect
              value={subTypeId}
              onChange={(v) => setSubTypeId(v ? Number(v) : "")}
              options={subTypeOptions}
              placeholder="Seleccione…"
            />
            {errors.subTypeId && <p className="text-xs text-red-600">{errors.subTypeId}</p>}
          </div>

          {/* Monto */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#33361D]">Monto</label>
            <input
              className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E]"
              placeholder="₡0,00"
              value={amountStr}
              onChange={(e) => (money as any).handleInput?.(e)} // ✅ esto deja escribir y formatea
            />
            {errors.amount && <p className="text-xs text-red-600">{errors.amount}</p>}
          </div>

          {errors.api && <p className="text-xs text-red-600">{errors.api}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t p-4 md:p-5">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={update.loading}
            className="rounded-xl bg-[#708C3E] px-4 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(ui, document.body)
}
