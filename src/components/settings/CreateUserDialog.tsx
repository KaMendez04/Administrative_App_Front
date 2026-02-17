import { z } from "zod"
import { useForm } from "@tanstack/react-form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../ui/dialog"
import type { CreateUserPayload } from "@/models/settings/UserCRUD"
import { zodMsg } from "@/shared/validators/zod"
import { ActionButtons } from "@/components/ActionButtons"
import { CustomSelect } from "@/components/CustomSelect"
import { strongPasswordSchema } from "@/shared/validators/password"
import { PasswordInput } from "../ChangePassword/PasswordInput"

const schema = z
  .object({
    username: z.string().trim().min(1, "Nombre del usuario requerido."),
    email: z.string().trim().email("Correo inválido."),
    password: strongPasswordSchema,
    confirmPassword: z.string(),
    roleId: z.coerce.number(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  })

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate: (payload: CreateUserPayload) => Promise<void>
}

export default function CreateUserDialog({ open, onOpenChange, onCreate }: Props) {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      roleId: 2,
    } as any,
    onSubmit: async ({ value }) => {
      const parsed = schema.safeParse(value)
      if (!parsed.success) return

      await onCreate({
        username: parsed.data.username,
        email: parsed.data.email,
        password: parsed.data.password,
        roleId: Number(parsed.data.roleId),
      })

      form.reset()
    },
  })

  const inputClass =
    "bg-[white] border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0 rounded-md"
  const labelClass =
    "block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide mb-1"
  const helpText = "mt-1 text-xs text-gray-500"
  const errorText = "mt-1 text-xs text-red-600"

  const roleOptions = [
    { value: 1, label: "ADMIN" },
    { value: 2, label: "JUNTA" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={[
          "p-0 border border-[#E6E1D6] shadow-2xl",
          "bg-[#FAF9F5] rounded-3xl",
          "w-[calc(100vw-2rem)] sm:max-w-2xl",
          "overflow-hidden",
        ].join(" ")}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-[#E6E1D6] bg-[white]">
            <DialogTitle>Crear usuario</DialogTitle>
            <DialogDescription>
            Asigna rol solo al crear. Luego no se podrá editar.
            </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Información del usuario
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username */}
              <form.Field
                name="username"
                validators={{
                  onChange: ({ value }) => zodMsg(schema.shape.username, value),
                  onBlur: ({ value }) => zodMsg(schema.shape.username, value),
                }}
              >
                {(f) => {
                  const err = f.state.meta.errors?.[0]
                  return (
                    <div>
                      <label className={labelClass}>Nombre del Usuario</label>
                      <Input
                        value={f.state.value}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value)}
                        className={inputClass}
                      />
                      <p className={helpText}>Ejemplo: Junta Directiva</p>
                      {err && <p className={errorText}>{err}</p>}
                    </div>
                  )
                }}
              </form.Field>

              {/* Email */}
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => zodMsg(schema.shape.email, value),
                  onBlur: ({ value }) => zodMsg(schema.shape.email, value),
                }}
              >
                {(f) => {
                  const err = f.state.meta.errors?.[0]
                  return (
                    <div>
                      <label className={labelClass}>Email</label>
                      <Input
                        type="email"
                        value={f.state.value}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value)}
                        className={inputClass}
                      />
                      <p className={helpText}>Ejemplo: tucorreo@dominio.com</p>
                      {err && <p className={errorText}>{err}</p>}
                    </div>
                  )
                }}
              </form.Field>

              {/* Password */}
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => zodMsg(schema.shape.password, value),
                  onBlur: ({ value }) => zodMsg(schema.shape.password, value),
                }}
              >
                {(f) => {
                  const err = f.state.meta.errors?.[0]
                  return (
                    <div>
                      <label className={labelClass}>Contraseña</label>
                      <PasswordInput
                        value={f.state.value}
                        onBlur={f.handleBlur}
                        onChange={(v) => f.handleChange(v)}
                        autoComplete="new-password"
                        className="h-11 border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0 rounded-md"
                      />
                      <ul className="mt-2 list-disc pl-5 text-[11px] text-gray-500">
                        <li>Al menos 8 caracteres</li>
                        <li>Una mayúscula, una minúscula, un número y un símbolo</li>
                      </ul>
                      {err && <p className={errorText}>{err}</p>}
                    </div>
                  )
                }}
              </form.Field>

              {/* Confirm Password */}
              <form.Field
            name="confirmPassword"
            validators={{
                onChangeListenTo: ["password"],
                onChange: ({ value, fieldApi }) => {
                const pwd = fieldApi.form.getFieldValue("password")
                if (!value) return "Confirmación requerida."
                if (value !== pwd) return "Las contraseñas no coinciden."
                return undefined
                },
                onBlur: ({ value, fieldApi }) => {
                const pwd = fieldApi.form.getFieldValue("password")
                if (!value) return "Confirmación requerida."
                if (value !== pwd) return "Las contraseñas no coinciden."
                return undefined
                },
            }}
            >
            {(f) => {
                const err = f.state.meta.errors?.[0]
                return (
                <div>
                    <label className={labelClass}>Confirmar contraseña</label>
                    <PasswordInput
                    value={f.state.value}
                    onBlur={f.handleBlur}
                    onChange={(v) => f.handleChange(v)}
                    autoComplete="new-password"
                    className="h-11 border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0 rounded-md"
                    />
                    <p className={helpText}>Repite la contraseña</p>
                    {err && <p className={errorText}>{err}</p>}
                </div>
                )
            }}
            </form.Field>

              {/* Rol */}
              <form.Field name="roleId">
                {(f) => (
                  <div>
                    <label className={labelClass}>Rol</label>
                    <CustomSelect
                      value={Number(f.state.value)}
                      onChange={(v) => f.handleChange(Number(v))}
                      options={roleOptions}
                      placeholder="Selecciona un rol"
                      buttonClassName="h-9"
                      size="md"
                      zIndex={80}
                    />
                    <p className={helpText}>Este rol solo se define al crear.</p>
                  </div>
                )}
              </form.Field>
            </div>
          </section>

          {/* Footer */}
          <div className="flex justify-end pt-5 border-t border-[#E6E1D6]">
            <ActionButtons
              onCancel={() => onOpenChange(false)}
              onSave={() => {}}
              showCancel
              showSave
              showText
              saveButtonType="submit"
              requireConfirmCancel={false}
              requireConfirmSave={false}
              saveText="Crear usuario"
              cancelText="Cancelar"
              isSaving={false}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
