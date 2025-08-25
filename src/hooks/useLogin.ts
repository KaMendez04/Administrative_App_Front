import { useEffect, useMemo, useState } from "react";
import { postLogin } from "../services/loginService";
import type { LoginPayload } from "../models/LoginType";
import { setSession } from "../services/auth";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ⛔️ nuevo: estado de rate limit
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [resetAt, setResetAt] = useState<number | null>(null);

  // contador regresivo en segundos (solo si hay resetAt)
  const remainingSeconds = useMemo(() => {
    if (!resetAt) return null;
    const diff = Math.max(0, resetAt - Date.now());
    return Math.ceil(diff / 1000);
  }, [resetAt]);

  useEffect(() => {
    if (!resetAt) return;
    const id = setInterval(() => {
      // fuerza rerender actualizando resetAt a sí mismo (gatilla remainingSeconds)
      // truco: cuando llegue a 0, liberamos el bloqueo
      if (Date.now() >= resetAt) {
        setIsRateLimited(false);
        setResetAt(null);
      } else {
        // no hacemos setState aquí para evitar bucles; el useMemo recalcula por paso del tiempo visual
      }
    }, 1000);
    return () => clearInterval(id);
  }, [resetAt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRateLimited) return; // protección extra
    setLoading(true);
    setError(null);

    try {
      const payload: LoginPayload = { email, password };
      const { user, token } = await postLogin(payload);

      setSession(token, user, remember);
      // redirección (ajusta si usas Router.navigate)
      window.location.href = "/Home";
    } catch (err: any) {
      // Si viene del interceptor 429 de apiConfig
      if (err?.isRateLimited) {
        setIsRateLimited(true);
        if (Number.isFinite(err?.msUntilReset)) {
          setResetAt(Date.now() + Number(err.msUntilReset));
        }
        setError(err?.message || "Has superado el límite de intentos. Intenta más tarde.");
      } else {
        setError(err?.message || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    remember,
    setRemember,
    loading,
    error,
    handleSubmit,
    // ⇩ nuevos para el botón/mensaje
    isRateLimited,
    remainingSeconds,
  };
}
