import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchExtraFull } from "../../../services/Budget/reportsExtra/extraReportService";
import { downloadExtraExcel } from "../../../services/Budget/extraordinary/ExtraordinaryService";

export function useExtraReport(filters:{start?:string;end?:string;name?:string}|null){
  return useQuery({ 
    queryKey:["report","extra","full",filters], 
    enabled:!!filters, 
    staleTime:60_000,
    queryFn:()=>fetchExtraFull(filters as any) 
  });
}

// ================================
// 3. components/Budget/Reports/extraTable.tsx
// ================================
const fmt = (n:number)=>new Intl.NumberFormat("es-CR",{style:"currency",currency:"CRC",maximumFractionDigits:0}).format(n||0);

export default function ExtraTable({rows,loading}:{rows:any[];loading?:boolean}){
  return (
    <div className="overflow-x-auto bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-5 py-3 text-left">ID</th>
            <th className="px-5 py-3 text-left">Movimiento extraordinario</th>
            <th className="px-5 py-3 text-left">Fecha</th>
            <th className="px-5 py-3 text-right">Monto</th>
            <th className="px-5 py-3 text-right">Usado</th>
            <th className="px-5 py-3 text-right">Restante</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                Cargando…
              </td>
            </tr>
          )}
          
          {!loading && rows.length===0 && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                Sin resultados
              </td>
            </tr>
          )}
          
          {!loading && rows.map(r=>(
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="px-5 py-3 text-gray-600">#{r.id}</td>
              <td className="px-5 py-3">{r.name ?? "—"}</td>
              <td className="px-5 py-3">{r.date ?? "—"}</td>
              <td className="px-5 py-3 text-right">{fmt(r.amount)}</td>
              <td className="px-5 py-3 text-right">{fmt(r.used)}</td>
              <td className="px-5 py-3 text-right">{fmt(r.remaining)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function useExtraReportExcel() {
  return useMutation<unknown, Error, {start?:string;end?:string;name?:string}>({
    mutationFn: async (filters) => {
      downloadExtraExcel(filters);
    },
  });
}
