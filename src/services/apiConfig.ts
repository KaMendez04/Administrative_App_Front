import axios from "axios";
import { getToken } from "./auth";

// ✅ Backend NestJS
export const apiUrl = "http://localhost:3000";

const apiConfig = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

// Interceptor de request: agrega Bearer si existe token
apiConfig.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
  }
  return config;
}, (error) => Promise.reject(error));

export default apiConfig;
