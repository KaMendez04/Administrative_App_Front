import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import {
  buildChangeSummary,
  formatDateTime,
  getActionBadgeClass,
  getActionLabel,
  getEntityLabel,
  getModuleLabel,
} from "@/utils/auditLogUtils"
import { LogsFilters, type LogsFiltersValue } from "../../components/logsComponents/LogsFilters"
import type { AuditLog } from "@/models/logsModel/AuditLog"
import { useAuditLogs } from "@/hooks/logsHooks/useAuditLogs"
import { ActionButtons } from "../../components/ActionButtons"
import { GenericTable } from "../../components/GenericTable"
import { PaginationBar, usePagination } from "../../components/ui/pagination"
import { AuditLogDetailModal } from "../../components/logsComponents/AuditLogDetailModal"

function buildApiFilters(filters: LogsFiltersValue) {
  const params: Record<string, any> = {}

  if (filters.entityType !== "ALL") params.entityType = filters.entityType
  if (filters.actionType !== "ALL") params.actionType = filters.actionType
  if (filters.from) params.from = filters.from
  if (filters.to) params.to = filters.to

  if (filters.module === "REAL") params.budgetScope = "REAL"
  if (filters.module === "PROJECTED") params.budgetScope = "PROJECTED"
  if (filters.module === "EXTRAORDINARY") params.budgetScope = "EXTRAORDINARY"
  if (filters.module === "USERS") params.entityType = "USER"

  return params
}

export default function LogsPage() {
  const [filters, setFilters] = React.useState<LogsFiltersValue>({
    search: "",
    module: "ALL",
    entityType: "ALL",
    actionType: "ALL",
    from: "",
    to: "",
  })

  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null)

  const apiFilters = React.useMemo(() => buildApiFilters(filters), [filters])
  const { data = [], isLoading } = useAuditLogs(apiFilters)

  const visibleRows = React.useMemo(() => {
    if (!filters.search.trim()) return data

    const q = filters.search.trim().toLowerCase()

    return data.filter((row) => {
      const text =
        `${row.actorUser?.username ?? ""} ${row.actorUser?.email ?? ""} ${row.description ?? ""} ${getEntityLabel(
          row.entityType,
        )} ${getActionLabel(row.actionType)} ${row.entityId}`.toLowerCase()

      return text.includes(q)
    })
  }, [data, filters.search])

  const { page, setPage, totalPages, pagedItems, pageItems } = usePagination(
    visibleRows,
    8,
    [filters.search, filters.module, filters.entityType, filters.actionType, filters.from, filters.to],
  )

  const columns = React.useMemo<ColumnDef<AuditLog>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Fecha",
        cell: ({ row }) => (
          <span className="font-medium text-[#2E321B]">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actor",
        header: "Usuario",
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-[#2E321B]">
              {row.original.actorUser?.username ?? "Sistema"}
            </div>
            <div className="text-xs text-gray-500">
              {row.original.actorUser?.email ?? "—"}
            </div>
          </div>
        ),
      },
      {
        id: "module",
        header: "Módulo",
        cell: ({ row }) => (
          <span className="text-[#2E321B]">{getModuleLabel(row.original)}</span>
        ),
      },
      {
        accessorKey: "entityType",
        header: "Entidad",
        cell: ({ row }) => (
          <span className="text-[#2E321B]">{getEntityLabel(row.original.entityType)}</span>
        ),
      },
      {
        accessorKey: "actionType",
        header: "Acción",
        cell: ({ row }) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getActionBadgeClass(
              row.original.actionType,
            )}`}
          >
            {getActionLabel(row.original.actionType)}
          </span>
        ),
      },
      {
        id: "summary",
        header: "Descripción",
        cell: ({ row }) => (
          <div className="text-[#2E321B]">{buildChangeSummary(row.original)}</div>
        ),
      },
      {
        id: "detail",
        header: "Detalle",
        cell: ({ row }) => (
          <ActionButtons onView={() => setSelectedLog(row.original)} showText={false} />
        ),
      },
    ],
    [],
  )

  const clearFilters = () => {
    setFilters({
      search: "",
      module: "ALL",
      entityType: "ALL",
      actionType: "ALL",
      from: "",
      to: "",
    })
  }

  return (
    <>
      <div className="">
        <aside className="">
          <LogsFilters value={filters} onChange={setFilters} onClear={clearFilters} />
        </aside>

        <section className="min-w-0">
          <div className="rounded-3xl border border-[#E6E1D6] bg-[#FAF9F5] shadow-sm overflow-hidden">
            <div className="border-b border-[#E6E1D6] bg-white/60 px-5 py-4">
              <h3 className="text-base font-bold text-[#374321]">Registros</h3>
              <p className="text-sm text-[#556B2F] mt-1">
                {visibleRows.length} resultado(s) encontrado(s)
              </p>
            </div>

            <div className="p-4 sm:p-5">
              <GenericTable<AuditLog>
                data={pagedItems}
                columns={columns}
                isLoading={isLoading}
              />

              <PaginationBar
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                pageItems={pageItems}
                className="mt-5"
              />
            </div>
          </div>
        </section>
      </div>

      <AuditLogDetailModal
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
        log={selectedLog}
      />
    </>
  )
}