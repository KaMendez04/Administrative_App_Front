import { useInitial } from "../../hooks/Budget/useInitial";
import { DataTable, StatCard } from "../../components/Budget/InitialComponents";

export default function InitialPage() {
  const { loading, error, cards, incomeRows, spendRows } = useInitial();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Cargando información...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error al cargar los datos.
      </div>
    );
  }

  // Calcular totales para las tablas
  const incomeTotalReal = incomeRows.reduce((sum, row) => sum + row.spent, 0);
  const incomeTotalProjected = incomeRows.reduce((sum, row) => sum + row.projected, 0);
  const incomeTotalDiff =  incomeTotalReal - incomeTotalProjected;

  const spendTotalReal = spendRows.reduce((sum, row) => sum + row.spent, 0);
  const spendTotalProjected = spendRows.reduce((sum, row) => sum + row.projected, 0);
  const spendTotalDiff =  spendTotalReal - spendTotalProjected;

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Inicio</h1>

          {/* ====== Cards métricas ====== */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Gastado"
              value={cards.totalGastado}
              color="red"
              icon="down"
            />
            <StatCard
              title="Total de Ingresos"
              value={cards.totalIngresos}
              color="green"
              icon="up"
            />
            <StatCard
              title="Saldo Restante"
              value={cards.saldoRestante}
              color="blue"
              icon="bars"
            />
          </div>

          {/* ====== Tablas ====== */}
          <DataTable
            title="Ingresos"
            rows={incomeRows}
            realLabel="Ingresos Reales"
            projLabel="Proyección de Ingresos"
            totalReal={incomeTotalReal}
            totalProjected={incomeTotalProjected}
            totalDiff={incomeTotalDiff}
            context="income"
          />
          <DataTable
            title="Egresos"
            rows={spendRows}
            realLabel="Egresos Reales"
            projLabel="Proyección de Egresos"
            totalReal={spendTotalReal}
            totalProjected={spendTotalProjected}
            totalDiff={spendTotalDiff}
            context="spend"
          />
        </div>
      </div>
    </div>
  );
}