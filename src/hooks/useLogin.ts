import { useState } from "react";
import { postLogin } from "../services/loginService";
import type { LoginPayload } from "../models/LoginType";
import { setSession } from "../services/auth";


export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: LoginPayload = { email, password };
      const { user, token } = await postLogin(payload);

      // Guarda token + usuario
      setSession(token, user, remember);
      // Si no, simple:
      window.location.href = "/Home"; // ruta
    } catch (err) {
      setError((err as Error).message || "Error al iniciar sesión");
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
  };
}
