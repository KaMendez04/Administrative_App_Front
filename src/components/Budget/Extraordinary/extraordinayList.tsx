import { crc } from "../../../utils/crcDateUtil";
import type { Extraordinary } from "../../../models/Budget/extraordinary/extraordinaryInterface";

interface ExtraordinayListProps {
    list: Extraordinary[];
    loading: boolean;
}

export default function ExtraordinayList({ list, loading }: ExtraordinayListProps) {
    return (
 <div>
                <div className="mt-6 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-gray-100">
                  <div className="border-b px-5 md:px-6 py-4">
                    <h2 className="text-base font-semibold text-gray-900">Movimientos registrados</h2>
                  </div>
        
                  {loading ? (
                    <div className="p-6 text-center text-gray-500">Cargando…</div>
                  ) : list.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No hay registros.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                              Movimiento
                            </th>
                            <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                              Fecha
                            </th>
                            <th className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                              Monto
                            </th>
                            <th className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                              Usado
                            </th>
                            <th className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                              Saldo restante
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {list.map((x) => {
                            const amountNum = Number(x.amount);
                            const usedNum = Number(x.used);
                            const remaining = Math.max(0, amountNum - usedNum);
                            return (
                              <tr key={x.id}>
                                <td className="px-5 py-2.5 text-sm text-gray-900">{x.name}</td>
                                <td className="px-5 py-2.5 text-sm text-gray-700">{x.date ?? "—"}</td>
                                <td className="px-5 py-2.5 text-right text-sm font-medium">{crc(amountNum)}</td>
                                <td className="px-5 py-2.5 text-right text-sm font-medium">{crc(usedNum)}</td>
                                <td className="px-5 py-2.5 text-right text-sm font-semibold">{crc(remaining)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>  
        </div>
    );
}