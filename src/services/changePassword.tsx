import type { ChangePassword } from "../models/ChangePasswordType"
import apiConfig from "../apiConfig/apiConfig"


export type ChangePasswordResult = {
  ok: boolean
  message?: string
}

type AxiosLikeError = {
  response?: { data?: any; status?: number }
  message?: string
}

export async function changePassword(
  data: ChangePassword
): Promise<ChangePasswordResult> {
  try {
    const { oldPassword, newPassword } = data

    // Tipamos la respuesta para que res.data?.message no marque error
    const res = await apiConfig.patch<{ message?: string }>(
      "/auth/change-password",
      { oldPassword, newPassword }
    )

    return {
      ok: true,
      message: res.data?.message ?? "Contraseña actualizada exitosamente.",
    }
  } catch (e: unknown) {
    const err = e as AxiosLikeError
    const raw = err.response?.data?.message

    const message = Array.isArray(raw)
      ? raw.join(", ")
      : raw ?? err.message ?? "No se pudo actualizar la contraseña."

    // Rechazamos con Error para que el hook muestre el banner
    throw new Error(message)
  }
}
