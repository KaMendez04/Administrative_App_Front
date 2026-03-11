import { useQuery } from "@tanstack/react-query"
import { getAuditLogs } from "@/services/logsServices/AuditLogService"
import type { GetAuditLogsParams } from "@/models/logsModel/GetAuditLogsParams"

export function useAuditLogs(params?: GetAuditLogsParams) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params),
  })
}