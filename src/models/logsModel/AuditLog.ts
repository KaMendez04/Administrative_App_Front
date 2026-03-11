export type AuditEntityType =
  | "USER"
  | "INCOME"
  | "SPEND"
  | "P_INCOME"
  | "P_SPEND"
  | "EXTRAORDINARY"

export type AuditActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "ALLOCATE"
  | "ASSIGN_TO_INCOME"
  | "USER_ACTIVATED"
  | "USER_DEACTIVATED"
  | "USER_PASSWORD_CHANGED"
  | "USER_EMAIL_CHANGE_REQUESTED"
  | "USER_EMAIL_CHANGE_CONFIRMED"

export type AuditBudgetScope = "REAL" | "PROJECTED" | "EXTRAORDINARY"

export interface AuditActorUser {
  id: number
  username: string
  email: string
}

export interface AuditFiscalYear {
  id: number
  year: number
  start_date: string
  end_date: string
  state: string
  is_active: boolean
}

export interface AuditRelatedExtraordinary {
  id: number
  name?: string
  amount?: string
  used?: string
  date?: string
}

export interface AuditLog {
  id: number
  actorUser?: AuditActorUser | null
  entityType: AuditEntityType
  entityId: number
  actionType: AuditActionType
  budgetScope?: AuditBudgetScope | null
  oldAmount?: string | null
  newAmount?: string | null
  oldUsed?: string | null
  newUsed?: string | null
  oldDate?: string | null
  newDate?: string | null
  oldName?: string | null
  newName?: string | null
  fiscalYear?: AuditFiscalYear | null
  subTypeTable?: string | null
  subTypeId?: number | null
  relatedExtraordinary?: AuditRelatedExtraordinary | null
  description?: string | null
  snapshotBefore?: Record<string, any> | null
  snapshotAfter?: Record<string, any> | null
  createdAt: string
}