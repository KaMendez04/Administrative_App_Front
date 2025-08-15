import { useLogin } from "../hooks/useLogin"
import LoginForm from "../components/Login/LoginForm"

export default function LoginPage() {
  const loginState = useLogin()

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        {/* Título */}
        <div className="text-center mb-16">
          <h1 className="text-[34px] font-semibold text-[#0F172A] tracking-tight">
            Iniciar Sesión
          </h1>
          <div className="mx-auto mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#BFD76F] to-[#708C3E]" />
        </div>

        {/* Formulario */}
        <LoginForm {...loginState} />
      </div>
    </div>
  )
}
