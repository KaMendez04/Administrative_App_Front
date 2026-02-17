import { requestEmailChange } from "@/services/Settings/EmailChangeService"
import { useMutation } from "@tanstack/react-query"

export function useRequestEmailChange() {
  return useMutation({
    mutationFn: requestEmailChange,
  })
}
