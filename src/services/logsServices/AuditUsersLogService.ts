import apiConfig from "@/apiConfig/apiConfig"
import type { AuditUsersLog } from "@/models/logsModel/AuditUsersLog"

export interface GetAuditUsersLogsParams {
  actorUserId?: number
  targetUserId?: number
  actionType?: string
  from?: string
  to?: string
}

export async function getAuditUsersLogs(params?: GetAuditUsersLogsParams) {
  const { data } = await apiConfig.get<AuditUsersLog[]>("/audit-users", { params })
  return data
}

export async function getAuditUsersLogById(id: number) {
  const { data } = await apiConfig.get<AuditUsersLog>(`/audit-users/${id}`)
  return data
}