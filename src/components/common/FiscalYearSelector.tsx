"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { useFiscalYear } from "../../hooks/Budget/useFiscalYear"
import { ChevronDown, ChevronUp, XCircle, Plus } from "lucide-react"

export default function FiscalYearSelector() {
  const { list, current, setCurrentById, createYear, closeYear, loading } = useFiscalYear()
  const [open, setOpen] = useState(false)
  const [confirmNew, setConfirmNew] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  const nextYear = useMemo(() => (current ? current.year + 1 : new Date().getFullYear() + 1), [current])

  // Cerrar al hacer click fuera
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!barRef.current) return
      if (!barRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  return (
    <div className="w-full" ref={barRef}>
      {/* ====== Pastilla encabezado ====== */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border-2 border-[#EAEFE0] bg-white px-4 py-2 text-sm text-[#33361D] shadow-sm hover:bg-[#F8F9F3] transition"
      >
        <span className="text-[#556B2F] font-semibold">Año:</span>
        <span className="font-bold text-[#5B732E]">{current?.year ?? "—"}</span>
        {open ? <ChevronUp className="h-4 w-4 text-[#556B2F]" /> : <ChevronDown className="h-4 w-4 text-[#556B2F]" />}
      </button>

      {/* ====== Barra desplegable ====== */}
      {open && (
        <div
          className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-[#EAEFE0] bg-[#F8F9F3] px-4 py-3 shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-sm font-semibold text-[#33361D] min-w-[80px]">Año fiscal</span>

          <select
            className="flex-1 px-3 py-2 rounded-xl border-2 border-[#EAEFE0] bg-white text-sm text-[#33361D] outline-none focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] transition"
            disabled={loading}
            value={current?.id ?? ""}
            onChange={(e) => setCurrentById(Number(e.target.value))}
          >
            {list.map((fy) => (
              <option key={fy.id} value={fy.id}>
                {fy.year}
                {fy.is_active ? " (activo)" : ""} {fy.state === "CLOSED" ? "[cerrado]" : ""}
              </option>
            ))}
          </select>

          {current?.state === "OPEN" && (
            <button
              onClick={() => setConfirmClose(true)}
              className="inline-flex items-center gap-1 rounded-xl border-2 border-[#C19A3D] bg-white px-4 py-2 text-xs font-semibold text-[#C19A3D] hover:bg-[#FEF6E0] transition"
            >
              <XCircle className="h-4 w-4" />
              Cerrar
            </button>
          )}

          {/* Botón nuevo */}
          <button
            onClick={() => setConfirmNew(true)}
            className="inline-flex items-center gap-1 rounded-xl bg-[#5B732E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#556B2F] transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nuevo {nextYear}
          </button>
        </div>
      )}

      {/* Confirmar crear nuevo */}
      {open && confirmNew && (
        <div className="mt-2 flex items-center gap-2 text-sm" onClick={(e) => e.stopPropagation()}>
          <span className="text-[#33361D]">¿Crear {nextYear} como activo?</span>
          <button
            className="rounded-xl bg-[#5B732E] px-3 py-1.5 text-white font-semibold hover:bg-[#556B2F] transition"
            onClick={async () => {
              await createYear({
                year: nextYear,
                start_date: `${nextYear}-01-01`,
                end_date: `${nextYear}-12-31`,
                is_active: true,
              })
              setConfirmNew(false)
            }}
          >
            Sí
          </button>
          <button
            className="rounded-xl border-2 border-[#EAEFE0] px-3 py-1.5 text-[#33361D] font-semibold hover:bg-[#F8F9F3] transition"
            onClick={() => setConfirmNew(false)}
          >
            No
          </button>
        </div>
      )}

      {/* Confirmar cerrar */}
      {open && confirmClose && current && (
        <div className="mt-2 flex items-center gap-2 text-sm" onClick={(e) => e.stopPropagation()}>
          <span className="text-[#33361D]">¿Cerrar {current.year}? (quedará inactivo)</span>
          <button
            className="rounded-xl bg-[#C19A3D] px-3 py-1.5 text-white font-semibold hover:bg-[#C6A14B] transition"
            onClick={async () => {
              await closeYear(current.id)
              setConfirmClose(false)
            }}
          >
            Sí
          </button>
          <button
            className="rounded-xl border-2 border-[#EAEFE0] px-3 py-1.5 text-[#33361D] font-semibold hover:bg-[#F8F9F3] transition"
            onClick={() => setConfirmClose(false)}
          >
            No
          </button>
        </div>
      )}
    </div>
  )
}