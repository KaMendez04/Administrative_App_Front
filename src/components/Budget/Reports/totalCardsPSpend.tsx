const crc = (n: number) =>
    new Intl.NumberFormat("es-CR", { 
      style: "currency", 
      currency: "CRC", 
      maximumFractionDigits: 0 
    }).format(Number.isFinite(n) ? n : 0);
  
  type PSpendTotalsCardsProps = {
    totals: {
      real: number;
      projected: number;
      difference: number;
    };
  };
  
  export function PSpendTotalsCards({ totals }: PSpendTotalsCardsProps) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow p-5">
          <div className="text-gray-500 text-sm">Total egresos (Reales)</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {crc(totals.real)}
          </div>
        </div>
        <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow p-5">
          <div className="text-gray-500 text-sm">Total egresos (Proyectados)</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {crc(totals.projected)}
          </div>
        </div>
        <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow p-5">
          <div className="text-gray-500 text-sm">Diferencia (Proj - Real)</div>
          <div className={`mt-2 text-2xl font-bold ${
            totals.difference >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            {crc(totals.difference)}
          </div>
        </div>
      </div>
    );
  }