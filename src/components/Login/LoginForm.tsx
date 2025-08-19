import React from "react"
import { Mail, Lock } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useLoginTanForm } from "../../hooks/useLoginTanform"
import { loginSchema, zodFieldValidator } from "../../schemas/loginSchema"


interface LoginFormProps {
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  remember: boolean
  setRemember: (v: boolean) => void
  loading: boolean
  error: string | null
  handleSubmit: (e: React.FormEvent) => void
}

export default function LoginForm(props: LoginFormProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    remember,
    setRemember,
    loading,
    error,
    handleSubmit,
  } = props

  const { form, onSubmit } = useLoginTanForm({
    email,
    password,
    remember,
    setEmail,
    setPassword,
    setRemember,
    handleSubmit,
  })

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* Email */}
      <form.Field
        name="email"
        validators={{ onChange: zodFieldValidator(loginSchema.shape.email) }}
      >
        {(field) => {
          const err = field.state.meta.errors[0]
          return (
            <div>
              {/* Contenedor SOLO del input e ícono (evita que el ícono se mueva con el error) */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <Mail className="h-[20px] w-[20px] text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="correo electrónico"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  className="w-full h-[56px] pl-11 pr-3 text-[16px] rounded-md border border-[#E2E8F0] bg-white
                             outline-none focus:border-[#7FB347] focus:ring-2 focus:ring-[#7FB347]/20 transition-colors"
                  required
                  aria-invalid={!!err}
                  aria-describedby="email-error"
                />
              </div>

              {err && (
                <p id="email-error" className="mt-1 text-sm text-red-500 pl-11">
                  {err}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      {/* Password */}
      <form.Field
        name="password"
        validators={{ onChange: zodFieldValidator(loginSchema.shape.password) }}
      >
        {(field) => {
          const err = field.state.meta.errors[0]
          return (
            <div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <Lock className="h-[20px] w-[20px] text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  className="w-full h-[56px] pl-11 pr-3 text-[16px] rounded-md border border-[#E2E8F0] bg-white
                             outline-none focus:border-[#7FB347] focus:ring-2 focus:ring-[#7FB347]/20 transition-colors"
                  required
                  aria-invalid={!!err}
                  aria-describedby="password-error"
                />
              </div>

              {err && (
                <p id="password-error" className="mt-1 text-sm text-red-500 pl-11">
                  {err}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      {/* Recordarme / Olvidé */}
      <form.Field name="remember">
        {(field) => (
          <div className="mt-2 flex items-center justify-between text-[15px]">
            <label className="flex items-center gap-2 text-[#1E293B]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => {
                  setRemember(e.target.checked)
                  field.handleChange(e.target.checked)
                }}
                className="h-[16px] w-[16px] rounded-full border border-[#CBD5E1] accent-[#7FB347]"
              />
              Recordarme
            </label>
            <Link to="/forgot-password" className="text-[#324B73] hover:underline">
              Olvidé mi contraseña
            </Link>
          </div>
        )}
      </form.Field>

      {/* Error externo */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Botón */}
      <form.Subscribe selector={(s) => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}>
        {({ canSubmit, isSubmitting }) => (
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || isSubmitting || !canSubmit}
              className="w-full h-[40px] rounded-full bg-[#C4A661] text-white text-[16px] font-semibold
                         transition-opacity hover:opacity-95 disabled:opacity-50"
            >
              {loading || isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}
