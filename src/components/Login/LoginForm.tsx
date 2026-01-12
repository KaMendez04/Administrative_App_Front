import React from "react"
import { Mail, Lock, AlertCircle } from "lucide-react"
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
  isRateLimited?: boolean
  remainingSeconds?: number | null
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
    isRateLimited = false,
    remainingSeconds = null,
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

  const buttonDisabled = loading || isRateLimited

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Email */}
      <form.Field
        name="email"
        validators={{ onChange: zodFieldValidator(loginSchema.shape.email) }}
      >
        {(field) => {
          const err = field.state.meta.errors[0]
          return (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Correo electrónico
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>

                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  className={[
                    "w-full h-11 pl-10 pr-3 text-[15px] rounded-md",
                    "border bg-white outline-none transition",
                    "placeholder:text-slate-400",
                    err
                      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 focus:border-[#7FB347] focus:ring-4 focus:ring-[#7FB347]/15",
                  ].join(" ")}
                  required
                  aria-invalid={!!err}
                  aria-describedby="email-error"
                />
              </div>

              {err && (
                <p id="email-error" className="text-sm text-red-600">
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Contraseña
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  className={[
                    "w-full h-11 pl-10 pr-3 text-[15px] rounded-md",
                    "border bg-white outline-none transition",
                    "placeholder:text-slate-400",
                    err
                      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 focus:border-[#7FB347] focus:ring-4 focus:ring-[#7FB347]/15",
                  ].join(" ")}
                  required
                  aria-invalid={!!err}
                  aria-describedby="password-error"
                />
              </div>

              {err && (
                <p id="password-error" className="text-sm text-red-600">
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
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-700 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => {
                  setRemember(e.target.checked)
                  field.handleChange(e.target.checked)
                }}
                className="h-4 w-4 rounded border-slate-300 accent-[#7FB347]"
              />
              Recordarme
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
            >
              Olvidé mi contraseña
            </Link>
          </div>
        )}
      </form.Field>

      {/* Error externo */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Botón */}
      <form.Subscribe
        selector={(s) => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}
      >
        {({ canSubmit, isSubmitting }) => {
          const disabled = buttonDisabled || isSubmitting || !canSubmit
          const label = isRateLimited
            ? remainingSeconds && remainingSeconds > 0
              ? `Demasiados intentos • espera ${remainingSeconds}s`
              : "Demasiados intentos"
            : loading || isSubmitting
              ? "Ingresando..."
              : "Ingresar"

          return (
            <button
              type="submit"
              disabled={disabled}
              className={[
                "w-full h-11 rounded-md text-[15px] font-semibold text-white",
                "bg-[#C4A661] border border-[#7FB347]/20 hover:opacity-95 transition",
                "shadow-sm shadow-black/5",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-4 focus:ring-[#C4A661]/25",
              ].join(" ")}
            >
              {label}
            </button>
          )
        }}
      </form.Subscribe>
    </form>
  )
}
