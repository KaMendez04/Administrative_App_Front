import { Plus } from 'lucide-react'
import { useState } from 'react'


export default function ExpensesProjectionPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="relative rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Proyección de Egresos</h1>

          {/* Botón arriba a la derecha */}
          <button
            onClick={() => setOpen(true)}
            className="absolute top-6 right-6 rounded-full bg-[#708C3E] p-3 text-white shadow hover:bg-[#5e732f]"
          >
            <Plus className="h-6 w-6" />
          </button>

          <div className="mt-8 grid grid-cols-1 gap-6">
            {/* Departamento (select, datos quemados) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Departamento</label>
              <select
                defaultValue="Servicios"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#A3853D]/40"
              >
                <option>Subasta</option>
                <option>Servicios</option>
              </select>
            </div>

            {/* Tipo (select, datos quemados) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
              <select
                defaultValue="Venta de ganado"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#A3853D]/40"
              >
                <option>Venta de ganado</option>
                <option>Comisión</option>
                <option>Trámite de matrícula</option>
                <option>Alquiler de equipos</option>
                <option>Alquiler salón multiuso</option>
              </select>
            </div>

            {/* SubTipo (select, datos quemados) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SubTipo</label>
              <select
                defaultValue="Pesaje de ganado"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#A3853D]/40"
              >
                <option>Comisión</option>
                <option>Pesaje de ganado</option>
                <option>Trámite de matrícula</option>
                <option>Alquiler de equipos</option>
                <option>Alquiler salón multiuso</option>
              </select>
            </div>

            {/* Monto */}
            <div>
  <div className="flex items-center justify-between mb-2">
    <label className="block text-sm font-semibold text-gray-700">Monto</label>
  </div>
  <div className="relative">
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₡</span>
    <input
      type="text"
      maxLength={15}
      inputMode="numeric"
      placeholder="0"
      onInput={(e) => {
        const target = e.target as HTMLInputElement
        const digits = target.value.replace(/\D/g, '').slice(0, 15) // solo números y 15 máx
        target.value = digits
          ? Number(digits).toLocaleString('es-CR', { maximumFractionDigits: 0 })
          : ''
      }}
      className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-3 py-3 text-gray-900 placeholder:text-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#A3853D]/40"
    />
  </div>
  <p className="mt-2 text-xs text-gray-500">Máx. 15 caracteres</p>
</div>



            {/* Botones */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-500 cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                disabled
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2 text-white opacity-50 cursor-not-allowed"
              >
                <Plus className="h-4 w-4" /> Registrar Partida
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Agregar nuevo registro</h2>

            {/* Departamento */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Agregar Departamento</label>
              <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner mb-3">
                <option>Selecciona un departamento</option>
                <option>Subasta</option>
                <option>Servicios</option>
              </select>
              <input
                type="text"
                maxLength={75}
                placeholder="Nuevo departamento"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner"
              />
              <p className="mt-2 text-xs text-gray-500">Si no existe, escríbelo aquí (máx. 75 caracteres)</p>
            </div>

            {/* Tipo */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Agregar Tipo</label>
              <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner mb-3">
                <option>Selecciona un tipo</option>
                <option>Venta de ganado</option>
                <option>Comisión</option>
                <option>Trámite de matrícula</option>
                <option>Alquiler de equipos</option>
                <option>Alquiler salón multiuso</option>
              </select>
              <input
                type="text"
                maxLength={75}
                placeholder="Nuevo tipo"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner"
              />
              <p className="mt-2 text-xs text-gray-500">Si no existe, escríbelo aquí (máx. 75 caracteres)</p>
            </div>

            {/* SubTipo */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Agregar SubTipo</label>
              <input
                type="text"
                maxLength={75}
                placeholder="Nuevo subTipo"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner"
              />
              <p className="mt-2 text-xs text-gray-500">Si no existe, escríbelo aquí (máx. 75 caracteres)</p>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button className="rounded-xl bg-[#708C3E] px-4 py-2 text-white shadow hover:bg-[#5e732f]">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
