import { CalendarDays, FileText, ShieldCheck, X, History } from "lucide-react"
import type { AuditLog } from "@/models/logsModel/AuditLog"
import {
  formatDateTime,
  formatMoney,
  getActionBadgeClass,
  getActionLabel,
  getEntityLabel,
  getModuleLabel,
} from "@/utils/auditLogUtils"

interface AuditLogDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  log?: AuditLog | null
}

export function AuditLogDetailModal({
  open,
  onOpenChange,
  log,
}: AuditLogDetailModalProps) {
  if (!open || !log) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[#FAF9F5] border border-[#E6E1D6] rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-[#E6E1D6] bg-white/60 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E6EDC8] text-[#5B732E]">
                <History className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#374321]">
                  Detalle del registro #{log.id}
                </h2>
                <p className="text-sm text-[#556B2F] mt-1">
                  Revisa la información general y los cambios registrados en la bitácora.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6E1D6] bg-white text-[#556B2F] transition hover:bg-[#F8F9F3]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-[#EAEFE0] px-3 py-1 text-xs font-semibold text-[#556B2F]">
              {getModuleLabel(log)}
            </span>

            <span className="inline-flex rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold text-[#374321]">
              {getEntityLabel(log.entityType)}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getActionBadgeClass(
                log.actionType,
              )}`}
            >
              {getActionLabel(log.actionType)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <SectionCard
              icon={<FileText className="h-4 w-4 text-[#708C3E]" />}
              title="Información general"
            >
              <DetailRow label="Fecha" value={formatDateTime(log.createdAt)} />
              <DetailRow label="Usuario" value={log.actorUser?.username ?? "Sistema"} />
              <DetailRow label="Entidad" value={getEntityLabel(log.entityType)} />
              <DetailRow label="Acción" value={getActionLabel(log.actionType)} />
              <DetailRow label="Módulo" value={getModuleLabel(log)} />
              <DetailRow label="Registro afectado" value={`#${log.entityId}`} />
              <DetailRow label="Descripción" value={log.description ?? "—"} />
            </SectionCard>

            <SectionCard
              icon={<ShieldCheck className="h-4 w-4 text-[#708C3E]" />}
              title="Cambios detectados"
            >
              <DetailRow label="Monto anterior" value={formatMoney(log.oldAmount)} />
              <DetailRow label="Monto nuevo" value={formatMoney(log.newAmount)} />
              <DetailRow label="Usado anterior" value={formatMoney(log.oldUsed)} />
              <DetailRow label="Usado nuevo" value={formatMoney(log.newUsed)} />
              <DetailRow label="Fecha anterior" value={log.oldDate ?? "—"} />
              <DetailRow label="Fecha nueva" value={log.newDate ?? "—"} />
              <DetailRow label="Nombre anterior" value={log.oldName ?? "—"} />
              <DetailRow label="Nombre nuevo" value={log.newName ?? "—"} />
              <DetailRow label="Subtipo" value={humanizeSubType(log.subTypeTable)} />
              <DetailRow label="Id subtipo" value={log.subTypeId ? String(log.subTypeId) : "—"} />
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <SnapshotCard
              title="Snapshot anterior"
              data={log.snapshotBefore}
              compareWith={log.snapshotAfter}
            />
            <SnapshotCard
              title="Snapshot nuevo"
              data={log.snapshotAfter}
              compareWith={log.snapshotBefore}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#E6E1D6] bg-[#F8F9F3] p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#374321]">
        {icon}
        {title}
      </div>

      <div className="space-y-3">{children}</div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[140px_1fr] sm:gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#556B2F]">
        {label}
      </span>
      <span className="break-words text-sm text-[#33361D]">{value}</span>
    </div>
  )
}

function SnapshotCard({
  title,
  data,
  compareWith,
}: {
  title: string
  data?: Record<string, any> | null
  compareWith?: Record<string, any> | null
}) {
  const entries = Object.entries(data ?? {})

  return (
    <div className="rounded-2xl border border-[#E6E1D6] bg-white p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#374321]">
        <CalendarDays className="h-4 w-4 text-[#708C3E]" />
        {title}
      </div>

      {!data || entries.length === 0 ? (
        <div className="rounded-xl bg-[#F8F9F3] p-4 text-sm text-gray-500">
          Sin datos
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(([key, value]) => {
            const changed = compareWith && compareWith[key] !== value

            return (
              <div
                key={key}
                className={`rounded-xl border p-3 ${
                  changed
                    ? "border-[#DCCCA3] bg-[#FFF8E7]"
                    : "border-[#EEF1E7] bg-[#F8F9F3]"
                }`}
              >
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[#556B2F] mb-1">
                  {humanizeSnapshotKey(key)}
                </div>
                <div className="text-sm text-[#33361D] break-words">
                  {formatSnapshotValue(key, value)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function humanizeSubType(value?: string | null) {
  switch (value) {
    case "income_sub_type":
      return "Subtipo de ingreso real"
    case "spend_sub_type":
      return "Subtipo de egreso real"
    case "p_income_sub_type":
      return "Subtipo de ingreso proyectado"
    case "p_spend_sub_type":
      return "Subtipo de egreso proyectado"
    default:
      return value ?? "—"
  }
}

function humanizeSnapshotKey(key: string) {
  switch (key) {
    case "id":
      return "Id"
    case "date":
      return "Fecha"
    case "amount":
      return "Monto"
    case "used":
      return "Usado"
    case "name":
      return "Nombre"
    case "fiscalYearId":
      return "Año fiscal"
    case "incomeSubTypeId":
      return "Subtipo ingreso real"
    case "spendSubTypeId":
      return "Subtipo egreso real"
    case "pIncomeSubTypeId":
      return "Subtipo ingreso proyectado"
    case "pSpendSubTypeId":
      return "Subtipo egreso proyectado"
    case "createdAt":
      return "Fecha creación"
    case "updatedAt":
      return "Fecha actualización"
    default:
      return key
  }
}

function formatSnapshotValue(key: string, value: any) {
  if (value === null || value === undefined || value === "") return "—"

  if (key === "amount" || key === "used") {
    const formatted = formatMoney(String(value))
    return formatted === "—" ? String(value) : formatted
  }

  if (
    key === "date" ||
    key === "createdAt" ||
    key === "updatedAt"
  ) {
    return typeof value === "string" ? value : String(value)
  }

  return String(value)
}