import { useSearch } from "@tanstack/react-router"
import { useResetPassword } from "../hooks/useResetPassword"

export default function ResetPasswordPage() {
  //  token del querystring (?token=...)
  const search = useSearch({ strict: false }) as { token?: string }
  const token = search?.token || ""

  const { password, setPassword, loading, error, done, handleSubmit } = useResetPassword(token)

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

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-semibold text-[#0F172A]">Nueva contraseña</h1>
          <p className="text-sm text-gray-600 mt-2">Ingresa tu nueva contraseña.</p>
        </div>

        {done ? (
          <div className="rounded-md border border-[#DCD6C9] bg-[#FAF9F5] p-4 text-sm">
            ¡Contraseña actualizada! Redirigiendo al login…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nueva contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[56px] px-4 text-[16px] rounded-md border border-[#E2E8F0] bg-white
                           outline-none focus:border-[#7FB347] focus:ring-2 focus:ring-[#7FB347]/20 transition-colors"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[40px] rounded-full bg-[#C4A661] text-white text-[16px] font-semibold
                         transition-opacity hover:opacity-95 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
