import type { RouterContext } from "../router/routerContext";
import { redirect } from "@tanstack/react-router";

export type AppRole = "ADMIN" | "JUNTA";

export function getLocationHref(location: any): string {
  const pathname = location.pathname || "/";
  
  if (typeof location.search === "string") {
    return location.search ? pathname + location.search : pathname;
  }
  
  if (location.search && typeof location.search === "object") {
    const params = new URLSearchParams();
    Object.entries(location.search).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    const searchString = params.toString();
    return searchString ? `${pathname}?${searchString}` : pathname;
  }
  
  return pathname;
}

function safeFrom(locationHref?: string) {
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