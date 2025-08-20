import type { PersonalPageType } from "../../models/PersonalPageType"

interface PersonalPageInfoModalProps {
  item: PersonalPageType
  onClose: () => void
}

export function PersonalPageInfoModal({ item, onClose }: PersonalPageInfoModalProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-[#FAF9F5] shadow-2xl border border-[#E6E1D6] ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
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
              <div className="text-[24px] leading-8 font-semibold text-[#2E321B]">
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

          {/* Divider */}
          <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-[#E6E1D6] to-transparent" />

          {/* Grid de datos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-[#E6E1D6] bg-white/90 px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#708C3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0V4a2 2 0 014 0v2"
                  />
                </svg>
                <span className="text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide">Cédula</span>
              </div>
              <span className="text-base font-medium text-[#374321]">
                {item.IDE}
              </span>
            </div>

            <div className="rounded-xl border border-[#E6E1D6] bg-white/90 px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#708C3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide">
                  Fecha de nacimiento
                </span>
              </div>
              <div className="text-base font-medium text-[#374321]">{formatDate(item.birthDate)}</div>
            </div>

            <div className="rounded-xl border border-[#E6E1D6] bg-white/90 px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#708C3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide">
                  Correo electrónico
                </span>
              </div>
              <div className="text-base font-medium text-[#374321] break-words">{item.email || "—"}</div>
            </div>

            <div className="rounded-xl border border-[#E6E1D6] bg-white/90 px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#708C3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide">Teléfono</span>
              </div>
              <div className="text-base font-medium text-[#374321]">{item.phone}</div>
            </div>

            <div className="md:col-span-2 rounded-xl border border-[#E6E1D6] bg-white/90 px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#708C3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide">Dirección</span>
              </div>
              <div className="text-base font-medium text-[#374321]">{item.direction}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
