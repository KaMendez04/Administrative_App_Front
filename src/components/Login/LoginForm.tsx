import React from "react"
import { Mail, Lock } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"

interface LoginFormProps {
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
  remember: boolean
  setRemember: (value: boolean) => void
  loading: boolean
  error: string | null
  handleSubmit: (e: React.FormEvent) => void
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  remember,
  setRemember,
  loading,
  error,
  handleSubmit,
}: LoginFormProps) {
  const navigate = useNavigate()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()            // evita recarga del form
    handleSubmit(e)               
    navigate({ to: "/Principal" })         // redirige a Principal
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* Email */}
      <div className="relative">
        <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-[20px] w-[20px] text-gray-400" />
        <input
          type="email"
          placeholder="correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[56px] pl-11 pr-3 text-[16px] rounded-md border border-[#E2E8F0] bg-white
                     outline-none focus:border-[#7FB347] focus:ring-2 focus:ring-[#7FB347]/20 transition-colors"
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-[20px] w-[20px] text-gray-400" />
        <input
          type="password"
          placeholder="contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-[56px] pl-11 pr-3 text-[16px] rounded-md border border-[#E2E8F0] bg-white
                     outline-none focus:border-[#7FB347] focus:ring-2 focus:ring-[#7FB347]/20 transition-colors"
          required
        />
      </div>

      {/* Recordarme / Olvidé */}
      <div className="mt-2 flex items-center justify-between text-[15px]">
        <label className="flex items-center gap-2 text-[#1E293B]">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-[16px] w-[16px] rounded-full border border-[#CBD5E1] accent-[#7FB347]"
          />
          Recordarme
        </label>

        <button type="button" className="text-[#324B73] hover:underline">
          Olvidé mi contraseña
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Botón */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[40px] rounded-full bg-[#C4A661] text-white text-[16px] font-semibold
                     transition-opacity hover:opacity-95 disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </div>
    </form>
  )
}
