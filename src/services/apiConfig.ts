import axios from "axios";
import { getToken } from "./auth";

export const apiUrl = "http://localhost:3000";

const apiConfig = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

// Utilidad simple para leer rate limit de headers
function parseRateLimitFromHeaders(h: any) {
  const remaining = Number(h?.["x-ratelimit-remaining"]);
  const retryAfter = Number(h?.["retry-after"]); // segundos
  const reset = Number(h?.["x-ratelimit-reset"]);
  const now = Date.now();

  const msFromRetryAfter = Number.isFinite(retryAfter) ? retryAfter * 1000 : undefined;
  const msFromReset = Number.isFinite(reset)
    ? (reset > 10_000_000 ? (reset * 1000 - now) : reset * 1000)
    : undefined;

  const msUntilReset = msFromRetryAfter ?? msFromReset ?? undefined;
  return {
    remaining: Number.isFinite(remaining) ? remaining : undefined,
    msUntilReset,
  };
}

// Interceptor de request (igual a tu patrón)
apiConfig.interceptors.request.use(
  (config) => {
    const token = getToken();
    config.headers = config.headers ?? {};
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de response: normaliza 429
apiConfig.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 429) {
      const rl = parseRateLimitFromHeaders(error.response.headers || {});
      return Promise.reject({
        isRateLimited: true,
        status: 429,
        message: "Demasiados intentos. Intenta nuevamente más tarde.",
        ...rl,
      });
    }
    return Promise.reject(error);
  },
);

export default apiConfig;
