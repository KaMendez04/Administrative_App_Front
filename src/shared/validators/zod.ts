import type { ZodTypeAny } from "zod"

export function zodMsg(schema: ZodTypeAny, value: unknown) {
  const r = schema.safeParse(value)
  if (r.success) return undefined
  return r.error.issues[0]?.message ?? "Campo inválido"
}
