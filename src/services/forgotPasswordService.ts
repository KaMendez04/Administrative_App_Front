const base = "http://localhost:3000";

export const forgotPasswordService = {
  async requestReset(email: string): Promise<{ ok: boolean; status: number; message?: string }> {
    const res = await fetch(`${base}/auth/request-reset-password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    // Por privacidad, devolvemos ok=true incluso si el correo no existe,
    // siempre que el backend responda 204 o cualquier 2xx.
    if (res.ok || res.status === 204) return { ok: true, status: res.status }

    // Si tu backend devuelve texto con error, lo leemos sin romper flujo
    const msg = await res.text().catch(() => undefined)
    return { ok: false, status: res.status, message: msg }
  },
}
