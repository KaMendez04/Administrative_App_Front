import { useForgotPassword } from "../hooks/useForgotPassword"

export default function ForgotPasswordPage() {
  const { email, setEmail, loading, sent, error, handleSubmit } = useForgotPassword()

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-semibold text-[#0F172A]">Restablecer contraseña</h1>
          <p className="text-sm text-gray-600 mt-2">
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        {sent ? (
          <div className="rounded-md border border-[#DCD6C9] bg-[#FAF9F5] p-4 text-sm">
            Si el correo existe en el sistema, recibirás un enlace de restablecimiento.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                required
                placeholder="correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
