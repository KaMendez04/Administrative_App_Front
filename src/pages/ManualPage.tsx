"use client"

import { FileText, Clock, ArrowLeft } from "lucide-react"

export default function ManualesPage() {
  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] px-6 py-10 pt-20">
      <div className="max-w-xl w-full text-center mx-auto">
        {/* Icon container */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#FAF1DF] flex items-center justify-center border-2 border-[#A3853D]">
              <FileText className="w-10 h-10 text-[#A3853D]" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#fff9ec] border-2 border-[#A3853D] flex items-center justify-center shadow-lg">
              <Clock className="w-4 h-4 text-[#A3853D]" strokeWidth={2} />
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#2E321B] mb-3 text-balance">Próximamente</h1>

        <h2 className="text-xl md:text-2xl font-semibold text-[#A3853D] mb-4 text-balance">Manuales de Usuario</h2>

        <p className="text-base text-[#2E321B]/70 mb-6 leading-relaxed text-pretty max-w-lg mx-auto">
          Estamos trabajando en crear manuales completos y detallados para ayudarte a aprovechar al máximo nuestro
          sistema.
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-16 bg-[#A3853D]/30"></div>
          <div className="w-2 h-2 rounded-full bg-[#A3853D]"></div>
          <div className="h-px w-16 bg-[#A3853D]/30"></div>
        </div>

        {/* Additional info card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#A3853D]/20">
          <p className="text-[#2E321B] text-sm leading-relaxed">
            Mientras tanto, si tienes alguna pregunta o necesitas asistencia, no dudes en contactar a nuestro equipo de
            soporte.
          </p>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs text-[#2E321B]/50">Los manuales estarán disponibles próximamente</p>
      </div>

      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-[#7A8B3D] hover:bg-[#6B7A2E] text-white font-medium px-5 py-2.5 rounded-lg shadow-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Regresar
        </button>
      </div>
    </div>
  )
}
