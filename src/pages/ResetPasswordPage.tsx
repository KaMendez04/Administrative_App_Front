
import { useSearch } from "@tanstack/react-router"
import { useResetPassword } from "../hooks/useResetPassword"
import { FormLabel } from "../components/ChangePassword/FormLabel"
import { PasswordInput } from "../components/ChangePassword/PasswordInput"
import { FormError } from "../components/ChangePassword/FormError"


export default function ResetPasswordPage() {
  const search = useSearch({ strict: false }) as { token?: string }
  const token = search?.token || ""

  if (!token) {
    return (
      <div className="w-full min-h-[calc(100vh-64px)] bg-white flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Token inválido o ausente.
          </div>
        </div>
      </div>
    )
  }

  const { form, loading, banner } = useResetPassword(token)

  const fieldClass =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-[#A3853D]"

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto rounded-2xl border border-[#E6E1D6] bg-white/90 shadow-sm">
        {/* Header */}
        <div className="border-b border-[#E6E1D6] px-6 py-5">
          <h1 className="text-2xl font-semibold text-[#2E321B]">Nueva contraseña</h1>
          <p className="text-sm text-gray-600 mt-1">
            Crea una contraseña segura con mayúsculas, minúsculas, números y símbolos.
          </p>
        </div>

        {/* Banner */}
        {banner && (
          <div
            className={`mx-6 mt-4 rounded-md border px-4 py-3 text-sm ${
              banner.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {banner.text}
          </div>
        )}

        {/* Form */}
        <form
          className="px-6 py-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          {/* Nueva contraseña */}
          <form.Field
            name="password"
            children={(field) => (
              <div>
                <FormLabel>Nueva contraseña</FormLabel>
                <PasswordInput
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(v) => field.handleChange(v)}
                  className={fieldClass}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
                <FormError message={field.state.meta.errors?.[0]} />
                <ul className="mt-2 text-[11px] text-gray-500 list-disc pl-5">
                  <li>Al menos 6 caracteres</li>
                  <li>Una mayúscula, una minúscula, un número y un símbolo</li>
                </ul>
              </div>
            )}
          />

          {/* Confirmar contraseña */}
          <form.Field
            name="confirmPassword"
            
            validators={{ onChangeListenTo: ["password"] }}
            children={(field) => (
              <div>
                <FormLabel>Confirmar nueva contraseña</FormLabel>
                <PasswordInput
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(v) => field.handleChange(v)}
                  className={fieldClass}
                  placeholder="Repite tu nueva contraseña"
                  autoComplete="new-password"
                />
                <FormError message={field.state.meta.errors?.[0]} />
              </div>
            )}
          />

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-[#708C3E] px-5 py-2.5 text-white text-sm font-medium hover:brightness-110 transition disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
