import { Lock } from "lucide-react"
import { useChangePassword } from "../../hooks/useChangePassword"
import { FormLabel } from "./FormLabel"
import { PasswordInput } from "./PasswordInput"
import { FormError } from "./FormError"
import { Button } from "../ui/button"

export default function ChangePasswordSection() {
  const { form, loading, banner } = useChangePassword()

  const fieldClass =
    "w-full h-11 rounded-xl border border-[#E6E1D6] bg-white/90 px-4 text-sm outline-none transition focus:border-[#A3853D]"

  return (
    <section className="space-y-4">
      <header className="flex items-start gap-2">
        <Lock className="mt-0.5 h-5 w-5 text-[#708C3E]" />
        <div>
          <h2 className="text-base font-semibold text-[#2E321B]">Contraseña</h2>
          <p className="mt-1 text-sm text-gray-600">
            Usa una contraseña robusta con mayúsculas, minúsculas, números y símbolos.
          </p>
        </div>
      </header>

      {banner && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            banner.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {banner.text}
        </div>
      )}

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="oldPassword">
          {(field) => (
            <div>
              <FormLabel>Contraseña actual</FormLabel>
              <PasswordInput
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(v) => field.handleChange(v)}
                className={fieldClass}
                autoComplete="current-password"
              />
              <p className="mt-1 text-xs text-gray-500">Escribe tu contraseña actual</p>
              <FormError message={field.state.meta.errors?.[0]} />
            </div>
          )}
        </form.Field>

        <form.Field name="newPassword">
          {(field) => (
            <div>
              <FormLabel>Nueva contraseña</FormLabel>
              <PasswordInput
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(v) => field.handleChange(v)}
                className={fieldClass}
                autoComplete="new-password"
              />
              <FormError message={field.state.meta.errors?.[0]} />
              <ul className="mt-2 list-disc pl-5 text-[11px] text-gray-500">
                <li>Al menos 8 caracteres</li>
                <li>Una mayúscula, una minúscula, un número y un símbolo</li>
              </ul>
            </div>
          )}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{ onChangeListenTo: ["newPassword"] }}
        >
          {(field) => (
            <div>
              <FormLabel>Confirmar nueva contraseña</FormLabel>
              <PasswordInput
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(v) => field.handleChange(v)}
                className={fieldClass}
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-gray-500">Repite tu nueva contraseña</p>
              <FormError message={field.state.meta.errors?.[0]} />
            </div>
          )}
        </form.Field>

        <div className="pt-1">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#708C3E] text-white hover:brightness-110"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </section>
  )
}
