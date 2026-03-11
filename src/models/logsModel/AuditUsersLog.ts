import type { AuditActionType, AuditActorUser } from "./AuditLog"

export interface AuditUsersLog {
  id: number
  actorUser?: AuditActorUser | null
  entityId: number
  actionType: AuditActionType
  oldDate?: string | null
  newDate?: string | null
  oldName?: string | null
  newName?: string | null
  subTypeTable?: string | null
  subTypeId?: number | null
  description?: string | null
  snapshotBefore?: Record<string, any> | null
  snapshotAfter?: Record<string, any> | null
  createdAt: string
}