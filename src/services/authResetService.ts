import type { ResetPasswordType } from "../models/ResetPasswordType"
import apiConfig from "./apiConfig"

export async function resetPassword(resetData: ResetPasswordType) {
  try {
    const res = await apiConfig.patch("/auth/reset-password", resetData)
    // si el backend devuelve 200/204 al éxito
    return { ok: true, status: res.status, data: res.data }
  } catch (err: any) {
    // Normaliza error
    const status = err?.response?.status ?? 0
    const message = err?.response?.data?.message || err?.message || "No se pudo actualizar la contraseña"

    return { ok: false, status, message }
  }
}