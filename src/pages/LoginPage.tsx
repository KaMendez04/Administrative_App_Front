import React, { useState } from "react"
import { Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email, password, remember })
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        {/* Título */}
        <div className="text-center mb-16">
          <h1 className="text-[34px] font-semibold text-[#0F172A] tracking-tight">Iniciar Sesión</h1>
          <div className="mx-auto mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#BFD76F] to-[#708C3E]" />

        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-10">
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

          {/* Botón */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-[40px] rounded-full bg-[#C4A661] text-white text-[16px] font-semibold
                         transition-opacity hover:opacity-95"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
