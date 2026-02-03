import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import { crc } from "../../../utils/crcDateUtil"
import type { Extraordinary } from "../../../models/Budget/extraordinary/extraordinaryInterface"
import { GenericTable } from "../../GenericTable"

// ✅ solo llamamos el componente/hook de paginación que ya tenés
import { usePagination, PaginationBar } from "../../ui/pagination"

interface ExtraordinayListProps {
  list: Extraordinary[]
  loading: boolean
}

export default function ExtraordinayList({ list, loading }: ExtraordinayListProps) {
  const columnHelper = createColumnHelper<Extraordinary>()

  const columns: ColumnDef<Extraordinary, any>[] = [
    columnHelper.accessor("name", {
      header: "Movimiento",
      size: 200,
      cell: (info) => (
        <div className="font-medium text-[#33361D]">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("date", {
      header: "Fecha",
      size: 120,
      cell: (info) => (
        <div className="text-[#33361D]">{info.getValue() ?? "—"}</div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: "Monto",
      size: 130,
      cell: (info) => (
        <div className="text-center font-medium text-[#33361D]">
          {crc(Number(info.getValue()))}
        </div>
      ),
    }),
    columnHelper.accessor("used", {
      header: "Usado",
      size: 130,
      cell: (info) => (
        <div className="text-center font-medium text-[#33361D]">
          {crc(Number(info.getValue()))}
        </div>
      ),
    }),
    columnHelper.display({
      id: "saldoRestante",
      header: () => <div className="text-center">Saldo Restante</div>,
      size: 150,
      cell: (info) => {
        const amountNum = Number(info.row.original.amount)
        const usedNum = Number(info.row.original.used)
        const remaining = Math.max(0, amountNum - usedNum)
        return (
          <div className="text-center font-semibold text-[#33361D]">
            {crc(remaining)}
          </div>
        )
      },
    }),
  ]

  // ✅ Paginación (máximo 10 por página) con mínimo código aquí
  const { page, setPage, totalPages, pagedItems, pageItems } = usePagination(
    list ?? [],
    10,
    [list]
  )

  return (
    <div>
      <div className="mt-6 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-gray-100">
        <div className="p-4">
          <GenericTable data={pagedItems} columns={columns} isLoading={loading} />

          {/* ✅ Paginación */}
          {!loading && (list?.length ?? 0) > 0 && totalPages > 1 && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <PaginationBar
                page={page}
                totalPages={totalPages}
                pageItems={pageItems}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
