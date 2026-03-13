import { X, History, FileText, ShieldCheck, CalendarDays } from "lucide-react"
import type { AuditUsersLog } from "@/models/logsModel/AuditUsersLog"
import { formatDateTime, getActionBadgeClass, getActionLabel } from "@/utils/auditLogUtils"

interface AuditUsersLogDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  log?: AuditUsersLog | null
}

export function AuditUsersLogDetailModal({ open, onOpenChange, log }: AuditUsersLogDetailModalProps) {
  if (!open || !log) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[#FAF9F5] border border-[#E6E1D6] rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6E1D6] bg-white text-[#556B2F] transition hover:bg-[#F8F9F3] flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* Badge acción */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getActionBadgeClass(log.actionType)}`}>
              {getActionLabel(log.actionType)}
            </span>
          </div>

          {/* Info general + Cambios detectados */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <SectionCard icon={<FileText className="h-4 w-4 text-[#708C3E]" />} title="Información general">
              <DetailRow label="Fecha" value={formatDateTime(log.createdAt)} />
              <DetailRow label="Realizado por" value={log.actorUser?.username ?? "Sistema"} />
              <DetailRow label="Correo actor" value={log.actorUser?.email ?? "—"} />
              <DetailRow label="Usuario afectado" value={log.targetUser?.username ?? "—"} />
              <DetailRow label="Correo afectado" value={log.targetUser?.email ?? "—"} />
              <DetailRow label="Acción" value={getActionLabel(log.actionType)} />
              <DetailRow label="Descripción" value={log.description ?? "—"} />
            </SectionCard>

            <SectionCard icon={<ShieldCheck className="h-4 w-4 text-[#708C3E]" />} title="Cambios detectados">
              {log.snapshotBefore && log.snapshotAfter ? (
                <>
                  {log.snapshotBefore.username !== log.snapshotAfter.username && (
                    <DetailRow label="Nombre" value={`${log.snapshotBefore.username ?? "—"} → ${log.snapshotAfter.username ?? "—"}`} />
                  )}
                  {log.snapshotBefore.email !== log.snapshotAfter.email && (
                    <DetailRow label="Correo" value={`${log.snapshotBefore.email ?? "—"} → ${log.snapshotAfter.email ?? "—"}`} />
                  )}
                  {log.snapshotBefore.isActive !== log.snapshotAfter.isActive && (
                    <DetailRow label="Estado" value={`${log.snapshotBefore.isActive ? "Activo" : "Inactivo"} → ${log.snapshotAfter.isActive ? "Activo" : "Inactivo"}`} />
                  )}
                  {log.snapshotBefore.roleId !== log.snapshotAfter.roleId && (
                    <DetailRow label="Rol" value={`${log.snapshotBefore.roleId ?? "—"} → ${log.snapshotAfter.roleId ?? "—"}`} />
                  )}
                  {log.snapshotBefore.username === log.snapshotAfter.username &&
                   log.snapshotBefore.email === log.snapshotAfter.email &&
                   log.snapshotBefore.isActive === log.snapshotAfter.isActive &&
                   log.snapshotBefore.roleId === log.snapshotAfter.roleId && (
                    <p className="text-sm text-gray-500">{log.description ?? "Sin cambios detectados"}</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">{log.description ?? "Sin datos de cambios"}</p>
              )}
            </SectionCard>
          </div>

          {/* Snapshots */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <SnapshotCard title="Snapshot anterior" data={log.snapshotBefore} compareWith={log.snapshotAfter} />
            <SnapshotCard title="Snapshot nuevo" data={log.snapshotAfter} compareWith={log.snapshotBefore} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionCard({ title, icon, children }: {
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
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[160px_1fr] sm:gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#556B2F]">
        {label}
      </span>
      <span className="break-words text-sm text-[#33361D]">{value}</span>
    </div>
  )
}

// Campos que se ocultan si están vacíos/null/false
const SKIP_IF_EMPTY = [
  "pendingEmail",
  "emailChangeTokenExpiresAt",
  "hasEmailChangeToken",
  "hasResetPasswordToken",
]

// Campos de fecha que se formatean con formatDateTime
const DATE_KEYS = [
  "resetPasswordTokenExpiresAt",
  "emailChangeTokenExpiresAt",
  "passwordChangedAt",
]

const FRIENDLY_KEYS: Record<string, string> = {
  id: "ID",
  username: "Nombre",
  email: "Correo",
  isActive: "Activo",
  roleId: "Rol ID",
  pendingEmail: "Correo pendiente",
  hasResetPasswordToken: "Token reset",
  hasEmailChangeToken: "Token correo",
  resetPasswordTokenExpiresAt: "Última recuperación de contraseña",
  emailChangeTokenExpiresAt: "Expira correo",
  passwordChangedAt: "Contraseña cambiada",
}

function isEmptyValue(value: any): boolean {
  return value === null || value === undefined || value === "" || value === false
}

function SnapshotCard({ title, data, compareWith }: {
  title: string
  data?: Record<string, any> | null
  compareWith?: Record<string, any> | null
}) {
  if (!data) {
    return (
      <div className="rounded-2xl border border-[#E6E1D6] bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#374321]">
          <CalendarDays className="h-4 w-4 text-[#708C3E]" />
          {title}
        </div>
        <div className="rounded-xl bg-[#F8F9F3] p-4 text-sm text-gray-500">Sin datos</div>
      </div>
    )
  }

  const entries = Object.entries(data).filter(([key, value]) => {
    if (SKIP_IF_EMPTY.includes(key) && isEmptyValue(value)) return false
    return true
  })

  return (
    <div className="rounded-2xl border border-[#E6E1D6] bg-white p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#374321]">
        <CalendarDays className="h-4 w-4 text-[#708C3E]" />
        {title}
      </div>
      {entries.length === 0 ? (
        <div className="rounded-xl bg-[#F8F9F3] p-4 text-sm text-gray-500">Sin datos</div>
      ) : (
        <div className="space-y-2">
          {entries.map(([key, value]) => {
            const changed = compareWith && compareWith[key] !== value

            const displayValue =
              value === null || value === undefined || value === ""
                ? "—"
                : key === "isActive"
                ? (value === true || value === "true" ? "Sí" : "No")
                : DATE_KEYS.includes(key)
                  ? formatDateTime(String(value))
                  : String(value)

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
                  {FRIENDLY_KEYS[key] ?? key}
                </div>
                <div className="text-sm text-[#33361D] break-words">
                  {displayValue}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}