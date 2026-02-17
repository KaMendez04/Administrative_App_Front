import apiConfig from "@/apiConfig/apiConfig"
import type { User } from "@/models/settings/User"
import type {
  RequestEmailChangePayload,
  RequestEmailChangeResponse,
} from "@/models/settings/RequestEmailChange"
import type { AdminSetPasswordPayload, CreateUserPayload, UpdateUserPayload } from "@/models/settings/UserCRUD"

export async function getUsers(): Promise<User[]> {
  const { data } = await apiConfig.get<User[]>("/users")
  return data
}

export async function getUser(id: number): Promise<User> {
  const { data } = await apiConfig.get<User>(`/users/${id}`)
  return data
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await apiConfig.post<User>("/users", payload)
  return data
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  const { data } = await apiConfig.patch<User>(`/users/${id}`, payload)
  return data
}

export async function setUserPassword(id: number, payload: AdminSetPasswordPayload): Promise<{ ok: true }> {
  const { data } = await apiConfig.patch<{ ok: true }>(`/users/${id}/password`, payload)
  return data
}

export async function deactivateUser(id: number): Promise<{ ok: true; isActive: boolean }> {
  const { data } = await apiConfig.patch<{ ok: true; isActive: boolean }>(`/users/${id}/deactivate`)
  return data
}

export async function activateUser(id: number): Promise<{ ok: true; isActive: boolean }> {
  const { data } = await apiConfig.patch<{ ok: true; isActive: boolean }>(`/users/${id}/activate`)
  return data
}

export async function requestEmailChangeForUser(
  id: number,
  payload: RequestEmailChangePayload,
): Promise<RequestEmailChangeResponse> {
  const { data } = await apiConfig.post<RequestEmailChangeResponse>(`/users/${id}/request-email-change`, payload)
  return data
}
