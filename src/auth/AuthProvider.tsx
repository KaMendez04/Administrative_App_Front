import React, { createContext, useContext, useMemo, useState } from "react";
import type { User } from "@/models/LoginType";
import { clearSession, getCurrentUser, getToken, setSession } from "./auth";
type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginWithSession: (token: string, user: User, remember?: boolean) => void;
  logout: () => void;
  refreshFromStorage: () => void;
  updateUserSession: (user: User) => void; // 👈 NUEVO
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [token, setToken] = useState<string | null>(() => getToken());

  const refreshFromStorage = () => {
    setUser(getCurrentUser());
    setToken(getToken());
  };

  const loginWithSession = (t: string, u: User, remember = false) => {
    setSession(t, u, remember);
    setUser(u);
    setToken(t);
  };

  const logout = () => {
    clearSession();
    setUser(null);
    setToken(null);
  };

  const updateUserSession = (updatedUser: User) => {
  // actualizar storage sin tocar el token
  const currentToken = getToken();
  if (!currentToken) return;

  // detecta dónde está guardado
  const isInLocal = localStorage.getItem("auth_token");
  const storage = isInLocal ? localStorage : sessionStorage;

  storage.setItem("auth_user", JSON.stringify(updatedUser));

  setUser(updatedUser);
};

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      loginWithSession,
      logout,
      refreshFromStorage,
      updateUserSession, 
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
