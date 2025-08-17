import type { LoginPayload, LoginResponse } from "../models/LoginType";

export async function postLogin(payload: LoginPayload): Promise<LoginResponse> {
  // 🔹 Ruta directa sin variables de entorno
  const url = "http://localhost:3000/auth/login";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  const data: LoginResponse = await res.json();
  return data;
}
