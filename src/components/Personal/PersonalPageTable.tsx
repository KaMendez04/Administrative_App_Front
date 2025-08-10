// src/components/PersonalPageTable.tsx
import { flexRender, type Table } from "@tanstack/react-table"
import type { PersonalPageType } from "../../models/PersonalPageType"


interface PersonalPageTableProps {
  table: Table<PersonalPageType>
}

export function PersonalPageTable({ table }: PersonalPageTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200 text-base">
      <thead className="bg-[#EEF4D8] text-[#374321]">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="font-semibold text-center">
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="px-5 py-4">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="divide-y divide-[#f1f1f1] text-gray-800 text-center">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-[#F9FAF6] transition duration-200">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-5 py-4">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
