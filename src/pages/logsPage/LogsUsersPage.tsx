import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { formatDateTime, getActionBadgeClass, getActionLabel } from "@/utils/auditLogUtils"
import { LogsUsersFilters, type LogsUsersFiltersValue } from "../../components/logsComponents/LogsUsersFilters"
import type { AuditUsersLog } from "@/models/logsModel/AuditUsersLog"
import { useAuditUsersLogs } from "@/hooks/logsHooks/useAuditUsersLogs"
import { GenericTable } from "../../components/GenericTable"
import { PaginationBar, usePagination } from "../../components/ui/pagination"
import { AuditUsersLogDetailModal } from "../../components/logsComponents/AuditUsersLogDetailModal"
import { ActionButtons } from "../../components/ActionButtons"

function buildApiFilters(filters: LogsUsersFiltersValue) {
  const params: Record<string, any> = {}
  if (filters.actionType !== "ALL") params.actionType = filters.actionType
  if (filters.from) params.from = filters.from
  if (filters.to) params.to = filters.to
  return params
}

function buildUserChangeSummary(row: AuditUsersLog): string {
  if (!row.snapshotBefore || !row.snapshotAfter) return row.description ?? "Sin detalle"
  const changes: string[] = []
  const b = row.snapshotBefore
  const a = row.snapshotAfter
  if (b.username !== a.username) changes.push(`Nombre: ${b.username ?? "—"} → ${a.username ?? "—"}`)
  if (b.email !== a.email) changes.push(`Correo: ${b.email ?? "—"} → ${a.email ?? "—"}`)
  if (b.isActive !== a.isActive) changes.push(`Estado: ${b.isActive ? "Activo" : "Inactivo"} → ${a.isActive ? "Activo" : "Inactivo"}`)
  if (b.roleId !== a.roleId) changes.push(`Rol: ${b.roleId ?? "—"} → ${a.roleId ?? "—"}`)
  return changes.length > 0 ? changes.join(" | ") : row.description ?? "Sin detalle adicional"
}

export default function LogsUsersPage() {
  const [filters, setFilters] = React.useState<LogsUsersFiltersValue>({
    search: "",
    actionType: "ALL",
    from: "",
    to: "",
  })

  const [selectedLog, setSelectedLog] = React.useState<AuditUsersLog | null>(null)
  const apiFilters = React.useMemo(() => buildApiFilters(filters), [filters])
  const { data = [], isLoading } = useAuditUsersLogs(apiFilters)

  const visibleRows = React.useMemo(() => {
    if (!filters.search.trim()) return data
    const q = filters.search.trim().toLowerCase()
    return data.filter((row) => {
      const text = `
        ${row.actorUser?.username ?? ""}
        ${row.actorUser?.email ?? ""}
        ${row.targetUser?.username ?? ""}
        ${row.targetUser?.email ?? ""}
        ${row.description ?? ""}
        ${getActionLabel(row.actionType)}
      `.toLowerCase()
      return text.includes(q)
    })
  }, [data, filters.search])

  const { page, setPage, totalPages, pagedItems, pageItems } = usePagination(
    visibleRows,
    8,
    [filters.search, filters.actionType, filters.from, filters.to],
  )

  const columns = React.useMemo<ColumnDef<AuditUsersLog>[]>(
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
        header: "Realizado por",
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-[#2E321B]">{row.original.actorUser?.username ?? "Sistema"}</div>
            <div className="text-xs text-gray-500">{row.original.actorUser?.email ?? "—"}</div>
          </div>
        ),
      },
      {
        id: "target",
        header: "Usuario afectado",
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-[#2E321B]">{row.original.targetUser?.username ?? "—"}</div>
            <div className="text-xs text-gray-500">{row.original.targetUser?.email ?? "—"}</div>
          </div>
        ),
      },
      {
        accessorKey: "actionType",
        header: "Acción",
        cell: ({ row }) => (
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getActionBadgeClass(row.original.actionType)}`}>
            {getActionLabel(row.original.actionType)}
          </span>
        ),
      },
      {
        id: "summary",
        header: "Descripción",
        cell: ({ row }) => (
          <div className="text-[#2E321B] text-sm">{buildUserChangeSummary(row.original)}</div>
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
    setFilters({ search: "", actionType: "ALL", from: "", to: "" })
  }

  return (
    <>
      <div className="space-y-6">
        <LogsUsersFilters value={filters} onChange={setFilters} onClear={clearFilters} />

        <div className="rounded-3xl border border-[#E6E1D6] bg-[#FAF9F5] shadow-sm overflow-hidden">
          <div className="border-b border-[#E6E1D6] bg-white/60 px-5 py-4">
            <h3 className="text-base font-bold text-[#374321]">Registros</h3>
            <p className="text-sm text-[#556B2F] mt-1">
              {visibleRows.length} resultado(s) encontrado(s)
            </p>
          </div>
          <div className="p-4 sm:p-5">
            <GenericTable<AuditUsersLog>
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
      </div>

      <AuditUsersLogDetailModal
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
        log={selectedLog}
      />
    </>
  )
}