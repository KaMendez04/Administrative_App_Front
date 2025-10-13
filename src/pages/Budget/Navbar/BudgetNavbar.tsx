import BudgetSubnav from "./BudgetSubnav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f8ef]">
      {/* Header principal existente */}
      <header className="sticky top-0 z-50 bg-[#f3f8ef] backdrop-blur border-b border-gray-200">
        {/* ...tu toolbar... */}
      </header>

      {/* Sub-nav de Presupuesto */}
      <BudgetSubnav />

      {/* Contenido */}
      <main className="mx-auto max-w-7xl px-4 py-6 bg-[#f3f8ef]">
        {children}
      </main>
    </div>
  )
}