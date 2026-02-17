import axios from "axios";
import { getToken, clearSession } from "../auth/auth";

export const apiUrl = import.meta.env.VITE_API_URL;

const apiConfig = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
});

// =====================
// Helpers
// =====================
const LS_FY_ID = "cg_currentFYId";

const NO_AUTH_PATHS = [
  "/auth/login",
  "/auth/request-reset-password",
  "/auth/reset-password",
];

function shouldSkipAuth(url?: string) {
  if (!url) return false;
  return NO_AUTH_PATHS.some((p) => url.includes(p));
}

function parseRateLimitFromHeaders(h: any) {
  const remaining = Number(h?.["x-ratelimit-remaining"]);
  const retryAfter = Number(h?.["retry-after"]); // segundos
  const reset = Number(h?.["x-ratelimit-reset"]);
  const now = Date.now();

  const msFromRetryAfter = Number.isFinite(retryAfter) ? retryAfter * 1000 : undefined;
  const msFromReset = Number.isFinite(reset)
    ? (reset > 10_000_000 ? reset * 1000 - now : reset * 1000)
    : undefined;

  const msUntilReset = msFromRetryAfter ?? msFromReset ?? undefined;
  return {
    remaining: Number.isFinite(remaining) ? remaining : undefined,
    msUntilReset,
  };
}

export type ApiError = {
  status?: number;
  message: string;
  data?: any;
  isRateLimited?: boolean;
  msUntilReset?: number;
  remaining?: number;
  isUnauthorized?: boolean;
  isForbidden?: boolean;
  raw?: any;
};

function normalizeAxiosError(error: any): ApiError {
  const status = error?.response?.status;
  const data = error?.response?.data;

  // Nest a veces manda message como string o array
  const msgFromData =
    typeof data?.message === "string"
      ? data.message
      : Array.isArray(data?.message)
        ? data.message.join(", ")
        : undefined;

  const message =
    msgFromData ||
    data?.error ||
    error?.message ||
    "Error de red. Intenta de nuevo.";

  return { status, data, message, raw: error };
}

// =====================
// Request interceptor
// =====================
apiConfig.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};

    // Authorization
    if (!shouldSkipAuth(config.url)) {
      const token = getToken();
      if (token) (config.headers as any).Authorization = `Bearer ${token}`;
    }

    // Content-Type (no forzar si es FormData)
    const isFormData = typeof FormData !== "undefined" && config.data instanceof FormData;
    if (!isFormData && !(config.headers as any)["Content-Type"]) {
      (config.headers as any)["Content-Type"] = "application/json";
    }

    // FY Header (solo si existe)
    const fyId = localStorage.getItem(LS_FY_ID);
    if (fyId) (config.headers as any)["X-Fiscal-Year-Id"] = fyId;
    else delete (config.headers as any)["X-Fiscal-Year-Id"];

    // Cache-Control
    (config.headers as any)["Cache-Control"] = "no-cache";

    return config;
  },
  (err) => Promise.reject(err),
);

// =====================
// Response interceptor
// =====================
apiConfig.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    // 429
    if (status === 429) {
      const rl = parseRateLimitFromHeaders(error.response.headers || {});
      const errObj: ApiError = {
        isRateLimited: true,
        status: 429,
        message: "Demasiados intentos. Intenta nuevamente más tarde.",
        ...rl,
        raw: error,
      };
      return Promise.reject(errObj);
    }

    // 401 -> token inválido/expirado
    if (status === 401) {
      clearSession();
      const errObj: ApiError = {
        isUnauthorized: true,
        status: 401,
        message: "Tu sesión expiró. Inicia sesión de nuevo.",
        raw: error,
      };
      return Promise.reject(errObj);
    }

    // 403 -> rol insuficiente
    if (status === 403) {
      const errObj: ApiError = {
        isForbidden: true,
        status: 403,
        message: "No tienes permisos para esta acción.",
        raw: error,
      };
      return Promise.reject(errObj);
    }

    return Promise.reject(normalizeAxiosError(error));
  },
);

export default apiConfig;
