import { io } from "socket.io-client";

export const adminSocket = io(`${import.meta.env.VITE_API_URL}/rt`, {
  autoConnect: false,        // 👈 no conectar todavía
  transports: ["websocket"], // 👈 conecta directo a WS
  upgrade: false,
  withCredentials: true,
  timeout: 5000,
  reconnectionAttempts: 3,
});

export function connectAdminSocket(token: string) {
  adminSocket.auth = { token };
  if (adminSocket.connected) adminSocket.disconnect();
  adminSocket.connect();
}
