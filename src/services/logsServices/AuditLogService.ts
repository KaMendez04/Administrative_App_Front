import apiConfig from "@/apiConfig/apiConfig"
import type { AuditLog } from "@/models/logsModel/AuditLog"
import type { GetAuditLogsParams } from "@/models/logsModel/GetAuditLogsParams"

export async function getAuditLogs(params?: GetAuditLogsParams) {
  const { data } = await apiConfig.get<AuditLog[]>("/audit-budget", {
    params,
  })
  return data
}

export async function getAuditLogById(id: number) {
  const { data } = await apiConfig.get<AuditLog>(`/audit-budget/${id}`)
  return data
}