import type {
  AuditActionType,
  AuditBudgetScope,
  AuditEntityType,
} from "./AuditLog"

export interface GetAuditLogsParams {
  entityType?: AuditEntityType
  entityId?: number
  actionType?: AuditActionType
  budgetScope?: AuditBudgetScope
  actorUserId?: number
  subTypeTable?: string
  subTypeId?: number
  relatedExtraordinaryId?: number
  from?: string
  to?: string
}