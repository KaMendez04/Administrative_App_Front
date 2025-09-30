import { useMemo, useState, useRef, useEffect } from "react";
import { useFiscalYear } from "../../hooks/Budget/useFiscalYear";
import { ChevronDown, ChevronUp, XCircle, Plus } from "lucide-react";

export default function FiscalYearSelector() {
  const { list, current, setCurrentById, createYear, closeYear, loading } = useFiscalYear();
  const [open, setOpen] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const nextYear = useMemo(
    () => (current ? current.year + 1 : new Date().getFullYear() + 1),
    [current]
  );

  // Cerrar al hacer click fuera
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!barRef.current) return;
      if (!barRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="w-full" ref={barRef}>
      {/* ====== Pastilla encabezado ====== */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <span className="text-slate-500">Año:</span>
        <span className="font-medium">{current?.year ?? "—"}</span>
        {open ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
      </button>

      {/* ====== Barra desplegable ====== */}
      {open && (
        <div
          className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2"
          // 👇 importante: que los clics dentro NO cierren el panel
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-xs text-slate-500 min-w-[80px]">Año fiscal</span>

          <select
            className="flex-1 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-emerald-200"
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
              className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
            >
              <XCircle className="h-4 w-4" />
              Cerrar
            </button>
          )}

          <button
            onClick={() => setConfirmNew(true)}
            className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
          >
            <Plus className="h-4 w-4" />
            Nuevo {nextYear}
          </button>
        </div>
      )}

      {/* Confirmar crear nuevo */}
      {open && confirmNew && (
        <div className="mt-2 flex items-center gap-2 text-sm" onClick={(e) => e.stopPropagation()}>
          <span className="text-slate-600">¿Crear {nextYear} como activo?</span>
          <button
            className="rounded bg-emerald-600 px-2 py-1 text-white"
            onClick={async () => {
              await createYear({
                year: nextYear,
                start_date: `${nextYear}-01-01`,
                end_date: `${nextYear}-12-31`,
                is_active: true,
              });
              setConfirmNew(false);
            }}
          >
            Sí
          </button>
          <button className="rounded border px-2 py-1" onClick={() => setConfirmNew(false)}>No</button>
        </div>
      )}

      {/* Confirmar cerrar */}
      {open && confirmClose && current && (
        <div className="mt-2 flex items-center gap-2 text-sm" onClick={(e) => e.stopPropagation()}>
          <span className="text-slate-600">¿Cerrar {current.year}? (quedará inactivo)</span>
          <button
            className="rounded bg-rose-600 px-2 py-1 text-white"
            onClick={async () => {
              await closeYear(current.id);
              setConfirmClose(false);
            }}
          >
            Sí
          </button>
          <button className="rounded border px-2 py-1" onClick={() => setConfirmClose(false)}>No</button>
        </div>
      )}
    </div>
  );
}
