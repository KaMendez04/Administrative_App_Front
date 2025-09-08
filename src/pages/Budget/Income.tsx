import React, { useMemo, useState } from "react";

export type IngresoPayload = {
  date: string;        // 'YYYY-MM-DD'
  description: string; // max 250
  subtotal: number;    // CRC
};

export type IngresoFormProps = {
  initialValue?: Partial<IngresoPayload>;
  onSubmit?: (data: IngresoPayload) => void;
  onCancel?: () => void;
};

const todayLocalISO = () => {
  const now = new Date();
  const tz = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - tz).toISOString().slice(0, 10);
};

const MAX_DESC = 250;
const MAX_AMOUNT = 999_999_999_999; // 12 dígitos

export default function IngresoForm({ initialValue, onSubmit, onCancel }: IngresoFormProps) {
  const today = todayLocalISO();

  const [date, setDate] = useState<string>(initialValue?.date ?? today);
  const [description, setDescription] = useState<string>(initialValue?.description ?? "");
  const [subtotal, setSubtotal] = useState<number>(
    typeof initialValue?.subtotal === "number" ? initialValue.subtotal : 0
  );

  const descCount = useMemo(() => description.length, [description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = subtotal > 0 && description.trim().length > 0 && date <= today;
    if (valid) {
      onSubmit?.({
        date,
        description: description.trim(),
        subtotal: Number.isFinite(subtotal) ? subtotal : 0,
      });
    }
  };

  const isDisabled = subtotal <= 0 || description.trim().length === 0 || date > today;

  return (
    // ======= Contenedor + Card (mismo patrón de la imagen) =======
    <div className="w-full px-6 lg:px-12 xl:px-20 max-w-7xl mx-auto">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 lg:p-10 shadow-md">
        <form onSubmit={handleSubmit} className="w-full">
          <style>{`
            /* Chrome, Safari, Edge */
            #monto::-webkit-outer-spin-button,
            #monto::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            /* Firefox */
            #monto {
              -moz-appearance: textfield;
            }
          `}</style>

          <h1 className="text-2xl font-semibold text-gray-900">Registrar Ingreso</h1>

          {/* Fecha de ingreso */}
          <div className="mt-6">
            <label htmlFor="fecha" className="mb-2 block text-sm font-medium text-gray-700">
              Fecha de ingreso
            </label>
            <input
              id="fecha"
              type="date"
              max={today}
              className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-gray-400"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Descripción */}
          <div className="mt-6">
            <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="descripcion"
              rows={5}
              maxLength={MAX_DESC}
              placeholder="Describe el origen del ingreso..."
              className="block w-full resize-y rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="mt-1 text-right text-xs text-gray-500">
              {descCount}/{MAX_DESC} caracteres
            </div>
          </div>

          {/* Monto del ingreso */}
          <div className="mt-6">
            <label htmlFor="monto" className="mb-2 block text-sm font-medium text-gray-700">
              Monto del ingreso (₡)
            </label>
            <input
              id="monto"
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_AMOUNT}
              className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-gray-400"
              value={subtotal === 0 ? "" : subtotal}
              onChange={(e) => {
                const next = Number(e.target.value || 0);
                setSubtotal(Math.min(next, MAX_AMOUNT));
              }}
            />
          </div>

          {/* Botones */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isDisabled}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold shadow-sm ${
                isDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-black"
              }`}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10">+</span>
              Registrar Ingreso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
