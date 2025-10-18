import { useState } from "react"

export function InfoSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-6 bg-white rounded-2xl shadow-sm border border-[#E5E8DC] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-5 hover:bg-[#F8F9F3] transition-colors"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#F8F9F3] flex items-center justify-center">
          <svg className="w-5 h-5 text-[#6B8E3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-bold text-[#3D4A1F]">¿Cómo se calculan estas métricas?</h3>
        </div>
        <svg 
          className={`w-5 h-5 text-[#6B7A4A] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-5 pb-5 pt-0">
          <div className="pl-13">
            <p className="text-xs text-[#6B7A4A] leading-relaxed">
              Comparamos los <span className="font-semibold text-[#3D4A1F]">últimos 30 días</span> con los <span className="font-semibold text-[#3D4A1F]">30 días anteriores</span>. 
              Los porcentajes muestran el cambio entre ambos períodos: 
              <span className="inline-flex items-center gap-1 mx-1 font-semibold text-[#4A7C2F]">
                <span className="text-sm">↑</span> verde
              </span> 
              indica mejora, 
              <span className="inline-flex items-center gap-1 mx-1 font-semibold text-[#B91C1C]">
                <span className="text-sm">↓</span> rojo
              </span> 
              indica disminución. Si aparece <span className="font-semibold text-[#6B7A4A]">"Sin datos previos"</span>, no hay registros del período anterior para comparar.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}