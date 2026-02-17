import { useMutation } from "@tanstack/react-query"
import { confirmEmailChange } from "@/services/Settings/UserSettingsService"
import type { ConfirmEmailChangePayload } from "@/models/settings/ConfirmEmailChange"

export function useConfirmEmailChange() {
  return useMutation({
    mutationFn: (payload: ConfirmEmailChangePayload) => confirmEmailChange(payload),
  })
}