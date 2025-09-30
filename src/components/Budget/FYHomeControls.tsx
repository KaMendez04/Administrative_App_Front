import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, CalendarPlus, Lock } from 'lucide-react';
import { useFiscalYear } from '../../hooks/Budget/useFiscalYear';

export default function FYHomeControls() {
  const { list, current, setCurrentById, createYear, closeYear, loading } = useFiscalYear();
  const [open, setOpen] = useState(false);
  const nextYear = useMemo(
    () => (current ? current.year + 1 : new Date().getFullYear() + 1),
    [current]
  );

  return (
    <div className="mb-4">
      {/* Botón compacto */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50 shadow-sm"
      >
        Año: {current ? current.year : '—'}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Panel inline (abre debajo del botón) */}
      {open && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] items-end">
            {/* Selector de año */}
            <div>
              <label className="block text-xs text-slate-500 mb-1">Año fiscal</label>
              <select
                disabled={loading}
                value={current?.id ?? ''}
                onChange={(e) => setCurrentById(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-sm"
              >
                {list.map(fy => (
                  <option key={fy.id} value={fy.id}>
                    {fy.year}{fy.is_active ? ' (activo)' : ''}{fy.state === 'CLOSED' ? ' [cerrado]' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Cerrar año (si está OPEN) */}
            <div className="flex sm:justify-end">
              {current?.state === 'OPEN' && (
                <button
                  onClick={() => closeYear(current.id)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-sm"
                >
                  <Lock className="w-4 h-4" /> Cerrar
                </button>
              )}
            </div>

            {/* Crear siguiente y activarlo */}
            <div className="flex sm:justify-end">
              <button
                onClick={async () => {
                  await createYear({
                    year: nextYear,
                    start_date: `${nextYear}-01-01`,
                    end_date: `${nextYear}-12-31`,
                    is_active: true,
                  });
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-sm"
              >
                <CalendarPlus className="w-4 h-4" /> Nuevo {nextYear}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
