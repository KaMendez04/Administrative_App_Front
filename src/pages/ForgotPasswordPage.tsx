// src/pages/ForgotPasswordPage.tsx
import { useForm } from "@tanstack/react-form"
import { useForgotPassword } from "../hooks/useForgotPassword"

import { Mail } from "lucide-react"
import { ForgotPasswordSchema } from "../schemas/forgotPasswordSchema"

export default function ForgotPasswordPage() {
  const { email, setEmail, loading, sent, error, submit } = useForgotPassword()

  // Validador de campo (sin adapter)
  const validateEmail = ({ value }: { value: string }) => {
    const r = ForgotPasswordSchema.shape.email.safeParse(value)
    return r.success ? undefined : r.error.issues[0]?.message || "Correo inválido"
  }

  const form = useForm({
    defaultValues: { email },
    onSubmit: async ({ value }) => {
      setEmail(value.email)
      const parsed = ForgotPasswordSchema.safeParse(value)
      if (!parsed.success) return
      await submit(parsed.data)
    },
  })

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FAF9F5] via-white to-[#FAF9F5] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Restablecer contraseña
          </h1>
          <p className="mt-3 text-base text-gray-500">
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        {/* Mensaje enviado */}
        {sent ? (
          <div className="rounded-lg border border-[#EADFC7] bg-[#FFFDF8] text-[#6B5B2E] px-5 py-4 text-sm shadow-sm text-center">
            Si el correo existe en el sistema, recibirás un enlace de restablecimiento.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            {/* Input */}
            <form.Field
              name="email"
              validators={{ onChange: validateEmail }}
              children={(field) => (
                <div>
                  <label className="sr-only">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Correo electrónico"
                      autoComplete="email"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 text-[15px]
                                 bg-white shadow-sm placeholder:text-gray-400
                                 focus:border-[#C4A661] focus:ring-2 focus:ring-[#C4A661]/30 outline-none
                                 transition"
                    />
                  </div>
                  {field.state.meta.errors?.[0] && (
                    <p className="mt-2 text-sm text-red-600">{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            />

            {/* Error genérico */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Botón refinado */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#C4A661] text-white font-semibold text-[15px]
                         shadow-[0_8px_24px_rgba(196,166,97,0.35)]
                         hover:shadow-[0_10px_28px_rgba(196,166,97,0.45)]
                         hover:brightness-110 active:brightness-95
                         transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando…" : "Enviar enlace"}
            </button>

            {/* Hint */}
            <p className="text-center text-sm text-gray-400">
              ¿No recibiste el correo? Revisa tu carpeta de <span className="font-medium">Spam</span>.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
