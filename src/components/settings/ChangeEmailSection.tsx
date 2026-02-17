import Swal from "sweetalert2"
import { z } from "zod"
import { useForm } from "@tanstack/react-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRequestEmailChange } from "@/hooks/settings/useRequestEmailChange"
import { useAuth } from "@/auth/AuthProvider"
import { zodMsg } from "@/shared/validators/zod"

const schema = z
  .object({
    newEmail: z.string().trim().email("Escribe un correo válido."),
    confirmEmail: z.string().trim().email("Confirma con un correo válido."),
  })
  .refine((data) => data.newEmail === data.confirmEmail, {
    path: ["confirmEmail"],
    message: "Los correos no coinciden.",
  })

export default function ChangeEmailSection() {
  const m = useRequestEmailChange()
  const { user } = useAuth()

  const form = useForm({
  defaultValues: { 
    newEmail: "",
    confirmEmail: "",
  },
    onSubmit: async ({ value }) => {
      try {
        const parsed = schema.safeParse(value)
        if (!parsed.success) return

        await m.mutateAsync({ id: user!.id, newEmail: parsed.data.newEmail })

        await Swal.fire({
          icon: "success",
          title: "Revisa tu correo",
          text: "Te enviamos un enlace de confirmación al nuevo correo.",
        })

        form.reset()
      } catch (e: any) {
        await Swal.fire({
          icon: "error",
          title: "No se pudo solicitar el cambio",
          text: e?.message ?? "Error",
        })
      }
    },
  })

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-base font-semibold text-[#2E321B]">Correo</h2>
        <p className="text-sm text-gray-600">
          Por seguridad, el cambio se confirma desde el nuevo correo.
        </p>
      </header>

      <form
        className="grid gap-4 "
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="newEmail"
          validators={{
            onChange: ({ value }) => zodMsg(schema.shape.newEmail, value),
            onBlur: ({ value }) => zodMsg(schema.shape.newEmail, value),
          }}
        >
          {(field) => (
            <div className="min-w-0">
              <label className="text-sm font-medium text-[#2E321B]">Nuevo correo</label>
              <Input
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">Ejemplo: nuevocorreo@dominio.com</p>
              {!!field.state.meta.errors?.[0] && (
                <p className="mt-2 text-xs text-red-600">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Confirmar Email */}
        <form.Field
          name="confirmEmail"
          validators={{
            onChangeListenTo: ["newEmail"],
            onChange: ({ value, fieldApi }) => {
              // 1) valida formato del confirmEmail
              const basic = zodMsg(schema.shape.confirmEmail, value)
              if (basic) return basic

              // 2) valida match (refine) con el objeto completo
              const r = schema.safeParse({
                newEmail: fieldApi.form.state.values.newEmail,
                confirmEmail: value,
              })
              if (!r.success) {
                const issue = r.error.issues.find((i) => i.path[0] === "confirmEmail")
                return issue?.message
              }
            },
            onBlur: ({ value, fieldApi }) => {
              const basic = zodMsg(schema.shape.confirmEmail, value)
              if (basic) return basic

              const r = schema.safeParse({
                newEmail: fieldApi.form.state.values.newEmail,
                confirmEmail: value,
              })
              if (!r.success) {
                const issue = r.error.issues.find((i) => i.path[0] === "confirmEmail")
                return issue?.message
              }
            },
          }}
        >
          {(field) => (
            <div className="min-w-0">
              <label className="text-sm font-medium text-[#2E321B]">
                Confirmar nuevo correo
              </label>
              <Input
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">Repite el nuevo correo</p>

              {!!field.state.meta.errors?.[0] && (
                <p className="mt-2 text-xs text-red-600">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={m.isPending || !user?.id}
            className="bg-[#708C3E] text-white hover:brightness-110"
            size="sm"
          >
            {m.isPending ? "Enviando..." : "Enviar enlace"}
          </Button>
        </div>
      </form>
    </section>
  )
}
