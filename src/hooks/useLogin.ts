import { useEffect, useMemo, useState } from "react";
import type { LoginPayload } from "../models/LoginType";

import { connectAdminSocket } from "../lib/socket";
import { showSuccessAlertLogin, showErrorAlertLogin } from "../utils/alerts";
import { mapLoginError } from "../utils/mapLoginError";

import { getRoleName } from "@/auth/role";
import { postLogin } from "@/auth/loginService";
import type { ApiError } from "@/apiConfig/apiConfig";
import { useAuth } from "@/auth/AuthProvider";

import { useNavigate, useSearch } from "@tanstack/react-router";

function pickSafeTo(from: unknown, fallback = "/Principal") {
  if (typeof from === "string" && from.startsWith("/")) return from;
  return fallback;
}

export function useLogin() {
  const navigate = useNavigate();
  const { loginWithSession } = useAuth();

  const search = useSearch({ from: "/login" });
  const from = search.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isRateLimited, setIsRateLimited] = useState(false);
  const [resetAt, setResetAt] = useState<number | null>(null);

  const remainingSeconds = useMemo(() => {
    if (!resetAt) return null;
    const diff = Math.max(0, resetAt - Date.now());
    return Math.ceil(diff / 1000);
  }, [resetAt]);

  useEffect(() => {
    if (!resetAt) return;
    const id = setInterval(() => {
      if (Date.now() >= resetAt) {
        setIsRateLimited(false);
        setResetAt(null);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [resetAt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRateLimited) return;

    setLoading(true);
    setError(null);

    try {
      const payload: LoginPayload = { email, password };
      const { user, token } = await postLogin(payload);

      loginWithSession(token, user, remember);

      if (getRoleName(user) === "ADMIN") {
        connectAdminSocket(token);
      }

      await showSuccessAlertLogin("Contraseña correcta, ingresando al sistema...");

      const destination = pickSafeTo(from, "/Principal");
      navigate({ to: destination, replace: true });
    } catch (err: unknown) {
      const e = err as ApiError;

      if (e?.isRateLimited) {
        setIsRateLimited(true);
        if (Number.isFinite(e.msUntilReset)) {
          setResetAt(Date.now() + Number(e.msUntilReset));
        }
        const msg =
          e.message || "Has superado el límite de intentos. Intenta más tarde.";
        setError(msg);
        showErrorAlertLogin(msg);
        return;
      }

      const msg = mapLoginError(err);
      setError(msg);
      showErrorAlertLogin(msg);
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
    isRateLimited,
    remainingSeconds,
  };
}