// src/models/roles.ts
export const hasRole = (userRole?: string, allowed: string[] = []) =>
  !!userRole && allowed.map(r => r.toUpperCase()).includes(userRole.toUpperCase());
