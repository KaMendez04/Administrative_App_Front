import apiConfig from "@/apiConfig/apiConfig"

export async function requestEmailChange(payload: { id: number; newEmail: string }) {
  const { data } = await apiConfig.post(
    `/users/${payload.id}/request-email-change`,
    { newEmail: payload.newEmail },
  )
  return data
}
