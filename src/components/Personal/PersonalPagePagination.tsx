// src/components/PersonalPagePagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Table } from "@tanstack/react-table"
import type { PersonalPageType } from "../../models/PersonalPageType"


interface PersonalPagePaginationProps {
  table: Table<PersonalPageType>
}

export function PersonalPagePagination({ table }: PersonalPagePaginationProps) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount() || 1

  const canPrev = table.getCanPreviousPage()
  const canNext = table.getCanNextPage()

  return (
    <div className="w-full flex items-center justify-center gap-3 select-none">
      {/* Flecha izquierda */}
      <button
        onClick={() => table.previousPage()}
        disabled={!canPrev}
        aria-label="Página anterior"
        className={`inline-flex items-center justify-center rounded-md shadow px-2 py-2
          ${canPrev ? "bg-[#EEF4D8] hover:bg-[#E7EDC8] text-[#374321]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}
        `}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Texto "Página X de Y" */}
      <span className="text-sm text-gray-700">
        Página <span className="font-semibold">{pageIndex + 1}</span> de{" "}
        <span className="font-semibold">{pageCount}</span>
      </span>

      {/* Flecha derecha */}
      <button
        onClick={() => table.nextPage()}
        disabled={!canNext}
        aria-label="Página siguiente"
        className={`inline-flex items-center justify-center rounded-md shadow px-2 py-2
          ${canNext ? "bg-[#EEF4D8] hover:bg-[#E7EDC8] text-[#374321]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}
        `}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
