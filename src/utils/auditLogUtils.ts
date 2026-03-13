import type {
  AuditActionType,
  AuditEntityType,
  AuditLog,
} from "@/models/logsModel/AuditLog"

export function formatDateTime(value?: string | null) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDateOnly(value?: string | null) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function formatMoney(value?: string | null) {
  if (!value) return "—"
  const num = Number(value)
  if (!Number.isFinite(num)) return value

  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 2,
  }).format(num)
}

export function getEntityLabel(entity: AuditEntityType) {
  switch (entity) {
    case "USER":
      return "Usuario"
    case "INCOME":
      return "Ingreso real"
    case "SPEND":
      return "Egreso real"
    case "P_INCOME":
      return "Ingreso proyectado"
    case "P_SPEND":
      return "Egreso proyectado"
    case "EXTRAORDINARY":
      return "Movimiento extraordinario"
    default:
      return entity
  }
}

export function getActionLabel(action: AuditActionType) {
  switch (action) {
    case "CREATE":
      return "Creación"
    case "UPDATE":
      return "Actualización"
    case "DELETE":
      return "Eliminación"
    case "ALLOCATE":
      return "Asignación"
    case "ASSIGN_TO_INCOME":
      return "Asignación a ingreso"
    case "USER_ACTIVATED":
      return "Activación"
    case "USER_DEACTIVATED":
      return "Desactivación"
    case "USER_PASSWORD_CHANGED":
      return "Cambio de contraseña"
    case "USER_EMAIL_CHANGE_REQUESTED":
      return "Solicitud cambio correo"
    case "USER_EMAIL_CHANGE_CONFIRMED":
      return "Confirmación cambio correo"
      case "USER_CREATED":
      return "Creación"
    case "USER_UPDATED":
      return "Actualización"
    case "USER_DELETED":
      return "Eliminación"
    default:
      return action
  }
}

export function getActionBadgeClass(action: AuditActionType) {
  switch (action) {
    case "CREATE":
      return "bg-[#E6EDC8] text-[#5B732E]"
    case "UPDATE":
      return "bg-[#FFF3D6] text-[#A3853D]"
    case "DELETE":
      return "bg-[#F6D8D2] text-[#B85C4C]"
    case "ALLOCATE":
    case "ASSIGN_TO_INCOME":
      return "bg-[#E8DCF8] text-[#6E4AA3]"
    default:
      return "bg-[#ECECEC] text-[#5A5A5A]"
    case "USER_CREATED":
    case "USER_ACTIVATED":
      return "bg-[#E6EDC8] text-[#5B732E]"
    case "USER_UPDATED":
      return "bg-[#FFF3D6] text-[#A3853D]"
    case "USER_DELETED":
      return "bg-[#F6D8D2] text-[#B85C4C]"
    case "USER_DEACTIVATED":
      return "bg-[#ECECEC] text-[#5A5A5A]"
    case "USER_PASSWORD_CHANGED":
    case "USER_EMAIL_CHANGE_REQUESTED":
    case "USER_EMAIL_CHANGE_CONFIRMED":
      return "bg-[#E8DCF8] text-[#6E4AA3]"
  }
}

export function getModuleLabel(row: AuditLog) {
  if (row.entityType === "USER") return "Usuarios"
  if (row.budgetScope === "REAL") return "Presupuesto real"
  if (row.budgetScope === "PROJECTED") return "Presupuesto proyectado"
  if (row.budgetScope === "EXTRAORDINARY") return "Extraordinarios"
  return "Sistema"
}

export function buildChangeSummary(row: AuditLog) {
  const changes: string[] = []

  if (row.oldAmount !== row.newAmount && (row.oldAmount || row.newAmount)) {
    changes.push(`Monto: ${formatMoney(row.oldAmount)} → ${formatMoney(row.newAmount)}`)
  }

  if (row.oldDate !== row.newDate && (row.oldDate || row.newDate)) {
    changes.push(`Fecha: ${formatDateOnly(row.oldDate)} → ${formatDateOnly(row.newDate)}`)
  }

  if (row.oldName !== row.newName && (row.oldName || row.newName)) {
    changes.push(`Nombre: ${row.oldName ?? "—"} → ${row.newName ?? "—"}`)
  }

  if (row.oldUsed !== row.newUsed && (row.oldUsed || row.newUsed)) {
    changes.push(`Usado: ${formatMoney(row.oldUsed)} → ${formatMoney(row.newUsed)}`)
  }

  return changes.length > 0 ? changes.join(" | ") : row.description ?? "Sin detalle adicional"
}