import { useQuery } from "@tanstack/react-query"
import { getAuditLogById } from "@/services/logsServices/AuditLogService"

export function useAuditLogById(id?: number, enabled = true) {
  return useQuery({
    queryKey: ["audit-log", id],
    queryFn: () => getAuditLogById(Number(id)),
    enabled: enabled && !!id,
  })
}