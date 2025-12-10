// src/components/Personal/PersonalPageInfoModal.tsx
import React from "react"
import { Download } from "lucide-react"
import type { PersonalPageType } from "../../models/PersonalPageType"
import { downloadPersonalPDF } from "../../utils/personalPdfUtils"

interface PersonalPageInfoModalProps {
  item: PersonalPageType
  onClose: () => void
}

export function PersonalPageInfoModal({ item, onClose }: PersonalPageInfoModalProps) {
  // mismas utilidades de estilo que usas en otros modales
  const label = "block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide mb-1"
  const box =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm text-[#2E321B]"
  const row = (l: string, v: React.ReactNode) => (
    <div>
      <span className={label}>{l}</span>
      <div className={box}>{v ?? "—"}</div>
    </div>
  )

  // Mostrar "—" si viene vacío / null
  const show = (v?: string | null) => (v && String(v).trim() !== "" ? v : "—")

  // 🔸 Manejador para cerrar al hacer clic en el fondo
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Solo cerrar si el clic fue directamente en el backdrop, no en el contenido
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#FAF9F5] border border-[#E6E1D6] rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E1D6] bg-white flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-[#374321]">Información del personal</h2>
          <div className="flex gap-3">
            <button
              onClick={() => downloadPersonalPDF(item)}
              className="flex items-center gap-2 bg-[#708C3E] hover:bg-[#5e7630] text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-[#E6E1D6] bg-white px-4 py-2 text-sm hover:bg-[#F4F1E7] transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-8">
          {/* Identificación */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Identificación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {row("Nombre", `${item.name ?? ""}`)}
              {row("Primer apellido", `${item.lastname1 ?? ""}`)}
              {row("Segundo apellido", `${item.lastname2 ?? ""}`)}
              <div className="md:col-span-3">{row("Cédula", show(item.IDE))}</div>
              <div className="md:col-span-3">{row("Fecha de nacimiento", show(item.birthDate))}</div>
            </div>
          </section>

          {/* Contacto */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {row("Teléfono", show(item.phone))}
              <div className="md:col-span-2">{row("Email", show(item.email))}</div>
              <div className="md:col-span-3">{row("Dirección", show(item.direction))}</div>
            </div>
          </section>

          {/* Perfil laboral */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Perfil laboral
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">{row("Puesto / ocupación", show(item.occupation))}</div>
              {row("Estado", item.isActive ? "Activo" : "Inactivo")}
              {row("Fecha de inicio laboral", show(item.startWorkDate))}
              {!item.isActive && row("Fecha de salida", show(item.endWorkDate))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PersonalPageInfoModal