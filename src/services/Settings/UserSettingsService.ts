import apiConfig from "@/apiConfig/apiConfig"
import type { ConfirmEmailChangePayload, ConfirmEmailChangeResponse } from "@/models/settings/ConfirmEmailChange"

function parseAxiosError(e: any) {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "Error inesperado"
  )
}

export async function confirmEmailChange(
  payload: ConfirmEmailChangePayload,
): Promise<ConfirmEmailChangeResponse> {
  try {
    const { data } = await apiConfig.post<ConfirmEmailChangeResponse>(
      "/users/confirm-email-change",
      payload,
    )
    return data
  } catch (e: any) {
    throw new Error(parseAxiosError(e))
  }
}
