import type { RouterContext } from "../router/routerContext";
import { redirect } from "@tanstack/react-router";

export type AppRole = "ADMIN" | "JUNTA";

function safeFrom(locationHref?: string) {
  // locationHref suele venir como "/ruta?x=1"
  // Aceptamos solo paths internos (evita open redirect tipo "https://...")
  if (!locationHref) return undefined;
  if (typeof locationHref !== "string") return undefined;
  return locationHref.startsWith("/") ? locationHref : undefined;
}

export function requireAuth(ctx: RouterContext, locationHref?: string) {
  const user = ctx.auth.user;
  if (!user) {
    throw redirect({
      to: "/login",
      search: { from: safeFrom(locationHref) },
    });
  }
  return user;
}

export function requireRole(
  ctx: RouterContext,
  roles: AppRole[],
  locationHref?: string,
) {
  const user = ctx.auth.user;
  if (!user) {
    throw redirect({
      to: "/login",
      search: { from: safeFrom(locationHref) },
    });
  }

  const role = String(user.role?.name ?? "").toUpperCase() as AppRole;
  const allowed = roles.map((r) => r.toUpperCase()) as AppRole[];

  if (!role || !allowed.includes(role)) {
    throw redirect({
      to: "/403",
      search: { from: safeFrom(locationHref) },
    });
  }

  return user;
}
