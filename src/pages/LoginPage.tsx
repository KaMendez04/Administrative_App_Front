import LoginForm from "../components/Login/LoginForm"
import { useLogin } from "../hooks/useLogin"
import { ArrowRight, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const loginState = useLogin()

  return (
    <div className="relative min-h-[calc(100vh-64px)]">
      {/* Fondo (solo estética) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-white to-white" />
      <div className="absolute inset-0 -z-10 [background:radial-gradient(80%_60%_at_50%_0%,rgba(127,179,71,0.12)_0%,transparent_60%)]" />

      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-lg items-center px-4 py-10">
        <div className="w-full">
          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="px-6 pt-8 pb-6">
              {/* Header */}
              <div className="text-center space-y-3">
                {/* ⬇️ MISMAS DIMENSIONES, solo icono */}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7FB347]/10 ring-1 ring-[#7FB347]/15">
                  <ShieldCheck className="h-6 w-6 text-[#7FB347]" />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                    Iniciar sesión
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Accede al sistema de la Cámara de Ganaderos
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <LoginForm {...loginState} />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Si tienes problemas para ingresar, contacta a soporte.
              </p>
            </div>
          </div>
           <div className="fixed bottom-6 right-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-[#7A8B3D] hover:bg-[#6B7A2E] text-white font-medium px-5 py-2.5 rounded-lg shadow-lg transition-colors duration-200"
        >
         
          Regresar
           <ArrowRight className="w-4 h-4" />
        </button>
      </div>
          

          {/* mini nota opcional */}
          <p className="mt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Cámara de Ganaderos
          </p>
        </div>
      </div>
    </div>
  )
}
