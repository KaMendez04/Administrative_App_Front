import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import "./index.css";

import { router } from "./router/Router";
import { AuthProvider, useAuth } from "@/auth/AuthProvider";

function AppRouter() {
  const { user, token, logout } = useAuth();
  (globalThis as any).__APP_AUTH__ = { logout };

  return (
    <RouterProvider
      router={router}
      context={{ auth: { user, token } }}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);
