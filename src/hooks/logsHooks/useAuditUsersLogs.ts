import { useQuery } from "@tanstack/react-query"
import { getAuditUsersLogs } from "@/services/logsServices/AuditUsersLogService"
import type { GetAuditUsersLogsParams } from "@/services/logsServices/AuditUsersLogService"

export function useAuditUsersLogs(params?: GetAuditUsersLogsParams) {
  return useQuery({
    queryKey: ["audit-users-logs", params],
    queryFn: () => getAuditUsersLogs(params),
  })
}