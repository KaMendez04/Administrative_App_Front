import React from "react"
import { Download } from "lucide-react"
import type { PersonalPageType } from "../../models/PersonalPageType"
import { usePersonalPdf } from "../../hooks/Personal/usePersonalPageState"


interface PersonalPageInfoModalProps {
  item: PersonalPageType
  onClose: () => void
}

export function PersonalPageInfoModal({ item, onClose }: PersonalPageInfoModalProps) {
  const { download, isDownloading } = usePersonalPdf()

  const label = "block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide mb-1"
  const box =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm text-[#2E321B]"
  const row = (l: string, v: React.ReactNode) => (
    <div>
      <span className={label}>{l}</span>
      <div className={box}>{v ?? "—"}</div>
    </div>
  )

  const show = (v?: string | null) => (v && String(v).trim() !== "" ? v : "—")

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleDownload = async () => {
    // ✅ Ajusta aquí según tu modelo real. En tu log: item.IdUser = 1
    const id = Number((item as any).id ?? (item as any).idPersonal ?? (item as any).IdUser)

    if (!Number.isFinite(id) || id <= 0) {
      console.error("ID inválido para PDF:", item)
      return
    }

    const filename = `personal_${id}.pdf`
    await download(id, filename)
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
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-[#708C3E] disabled:opacity-60 hover:bg-[#5e7630] text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Generando..." : "Descargar PDF"}
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
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Identificación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {row("Nombre", `${item.name ?? ""}`)}
              {row("Primer apellido", `${item.lastname1 ?? ""}`)}
              {row("Segundo apellido", `${item.lastname2 ?? ""}`)}
              <div className="md:col-span-3">{row("Cédula", show((item as any).IDE))}</div>
              <div className="md:col-span-3">{row("Fecha de nacimiento", show((item as any).birthDate))}</div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {row("Teléfono", show((item as any).phone))}
              <div className="md:col-span-2">{row("Email", show((item as any).email))}</div>
              <div className="md:col-span-3">{row("Dirección", show((item as any).direction))}</div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Perfil laboral
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">{row("Puesto / ocupación", show((item as any).occupation))}</div>
              {row("Estado", (item as any).isActive ? "Activo" : "Inactivo")}
              {row("Fecha de inicio laboral", show((item as any).startWorkDate))}
              {!(item as any).isActive && row("Fecha de salida", show((item as any).endWorkDate))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PersonalPageInfoModal
