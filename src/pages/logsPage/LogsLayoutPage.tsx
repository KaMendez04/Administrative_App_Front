import LogsPage from "@/components/logs/LogsPage"
import { ScrollText } from "lucide-react"

export default function LogsLayoutPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8F9F3]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mx-auto w-full max-w-6xl">
          {/* Header */}
          <div className="mb-6 rounded-2xl border border-[#E6E1D6] bg-white/90 shadow-sm">
            <div className="flex items-start gap-4 px-6 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6EDC8] text-[#5A7018]">
                <ScrollText className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-[#2E321B]">
                  Bitácora de cambios
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Consulta los cambios realizados en usuarios, presupuesto real,
                  presupuesto proyectado y movimientos extraordinarios.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <main className="min-w-0">
            <div className="rounded-2xl border border-[#E6E1D6] bg-white/90 shadow-sm">
              <div className="p-4 sm:p-6">
                <LogsPage />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}