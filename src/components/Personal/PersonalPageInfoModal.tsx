import type { PersonalPageType } from "../../models/PersonalPageType"

interface PersonalPageInfoModalProps {
  item: PersonalPageType
  onClose: () => void
}

export function PersonalPageInfoModal({ item, onClose }: PersonalPageInfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-[#FAF9F5] shadow-2xl border border-[#E6E1D6] ring-1 ring-black/5 overflow-hidden">
        {/* Header (sin botón) */}
        <div className="px-6 py-5 border-b border-[#E6E1D6] bg-white/60">
          <h2 className="text-xl font-bold text-[#374321]">Información adicional</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Nombre completo + Estado */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-6">
            <div>
              <span className="block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide mb-1">
                Nombre completo
              </span>
              <div className="text-[22px] leading-7 font-semibold text-[#2E321B]">
                {item.name} {item.lastname1} {item.lastname2}
              </div>
            </div>

            <div className="md:text-right">
              <span className="block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide mb-1">
                Estado
              </span>
              <span
                className={`inline-block rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm ${
                  item.isActive
                    ? "bg-green-100 text-[#4D7031] border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {item.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>

          {/* Divider sutil */}
          <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-[#E6E1D6] to-transparent" />

          {/* Grid de datos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#E6E1D6] bg-white/90 px-4 py-3 shadow-sm">
              <span className="block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide">
                Cédula
              </span>
              <span className="mt-1 inline-block rounded-lg bg-[#F6F3EC] px-3 py-1 text-sm text-[#374321] border border-[#E6E1D6]">
                {item.IDE}
              </span>
            </div>

            <div className="rounded-xl border border-[#E6E1D6] bg-white/90 px-4 py-3 shadow-sm">
              <span className="block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide">
                Fecha de nacimiento
              </span>
              <span className="mt-1 block text-sm text-[#374321]">
                {item.birthdate}
              </span>
            </div>

            <div className="rounded-xl border border-[#E6E1D6] bg-white/90 px-4 py-3 shadow-sm">
              <span className="block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide">
                Correo
              </span>
              <span className="mt-1 block text-sm text-[#374321] break-words">
                {item.email || "—"}
              </span>
            </div>

            <div className="rounded-xl border border-[#E6E1D6] bg-white/90 px-4 py-3 shadow-sm">
              <span className="block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide">
                Teléfono
              </span>
              <span className="mt-1 block text-sm text-[#374321]">
                {item.phone}
              </span>
            </div>

            <div className="md:col-span-2 rounded-xl border border-[#E6E1D6] bg-white/90 px-4 py-3 shadow-sm">
              <span className="block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide">
                Ubicación
              </span>
              <span className="mt-1 block text-sm text-[#374321]">
                {item.direction}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 shadow-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
