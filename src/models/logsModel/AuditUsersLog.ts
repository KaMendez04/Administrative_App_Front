import type { AuditActionType } from "./AuditLog"

export interface AuditUserActorUser {
  id: number
  username: string
  email: string
  isActive: boolean
}

export interface AuditUsersLog {
  id: number
  actorUser?: AuditUserActorUser | null
  targetUser?: AuditUserActorUser | null
  actionType: AuditActionType
  description?: string | null
  snapshotBefore?: Record<string, any> | null
  snapshotAfter?: Record<string, any> | null
  createdAt: string
}