import BudgetSubnav from "./BudgetSubnav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7F4]">
      {/* Header principal existente */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        {/* ...tu toolbar... */}
      </header>

      {/* Sub-nav de Presupuesto */}
      <BudgetSubnav />

      {/* Contenido */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  )
}
