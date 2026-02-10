import React, { createContext, useContext, useMemo, useState } from "react";
import type { User } from "@/models/LoginType";
import { clearSession, getCurrentUser, getToken, setSession } from "./auth";
//Esto centraliza sesión (lee storage al cargar, expone logout, etc.)
type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginWithSession: (token: string, user: User, remember?: boolean) => void;
  logout: () => void;
  refreshFromStorage: () => void;
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

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      loginWithSession,
      logout,
      refreshFromStorage,
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
