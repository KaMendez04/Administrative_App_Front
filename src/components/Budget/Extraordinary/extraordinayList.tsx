import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { crc } from "../../../utils/crcDateUtil";
import type { Extraordinary } from "../../../models/Budget/extraordinary/extraordinaryInterface";
import { GenericTable } from "../../GenericTable";

interface ExtraordinayListProps {
  list: Extraordinary[];
  loading: boolean;
}

export default function ExtraordinayList({ list, loading }: ExtraordinayListProps) {
  const columnHelper = createColumnHelper<Extraordinary>();

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
        const amountNum = Number(info.row.original.amount);
        const usedNum = Number(info.row.original.used);
        const remaining = Math.max(0, amountNum - usedNum);
        return (
          <div className="text-center font-semibold text-[#33361D]">
            {crc(remaining)}
          </div>
        );
      },
    }),
  ];

  return (
    <div>
      <div className="mt-6 rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-gray-100">
        <div className="p-4">
          <GenericTable data={list} columns={columns} isLoading={loading} />
        </div>
      </div>
    </div>
  );
}