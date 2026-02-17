import ChangePasswordSection from "@/components/ChangePassword/ChangePasswordSection"
import { AccountProfileSection } from "@/components/settings/AccountProfileSection"
import ChangeEmailSection from "@/components/settings/ChangeEmailSection"

export default function AccountPanel() {
  return (
    <div className="rounded-2xl border border-[#E6E1D6] bg-white/90 shadow-sm">
      <div className="border-b border-[#E6E1D6] px-6 py-5">
        <h1 className="text-xl font-semibold text-[#2E321B]">Cuenta</h1>
        <p className="mt-1 text-sm text-gray-600">Gestiona tu correo y contraseña.</p>
      </div>

      <div className="divide-y divide-[#E6E1D6]">
        <AccountProfileSection />

        <div className="px-6 py-6">
          <ChangeEmailSection />
        </div>

        <div className="px-6 py-6">
          <ChangePasswordSection />
        </div>
      </div>
    </div>
  )
}
