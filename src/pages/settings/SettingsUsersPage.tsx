import { useMemo, useState } from "react"
import Swal from "sweetalert2"

import { useUsers } from "@/hooks/settings/useUsers"
import { useUserMutations } from "@/hooks/settings/useUserMutations"
import UsersTable from "@/components/settings/UsersTable"
import CreateUserDialog from "@/components/settings/CreateUserDialog"
import { ActionButtons } from "@/components/ActionButtons"

export default function SettingsUsersPage() {
  const q = useUsers()
  const m = useUserMutations()

  const [openCreate, setOpenCreate] = useState(false)

  const users = q.data ?? []
  const loading = q.isLoading
  const rows = useMemo(() => users, [users])

  const onDeactivate = async (id: number) => {
    const r = await Swal.fire({
      icon: "warning",
      title: "¿Desactivar usuario?",
      text: "El usuario no podrá iniciar sesión hasta que lo actives de nuevo.",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    })
    if (!r.isConfirmed) return

    try {
      await m.deactivate.mutateAsync(id)
      await Swal.fire({ icon: "success", title: "Desactivado", timer: 1200, showConfirmButton: false })
    } catch (e: any) {
      await Swal.fire({ icon: "error", title: "Error", text: e?.message ?? "Ocurrió un error" })
    }
  }

  const onActivate = async (id: number) => {
    try {
      await m.activate.mutateAsync(id)
      await Swal.fire({ icon: "success", title: "Activado", timer: 1200, showConfirmButton: false })
    } catch (e: any) {
      await Swal.fire({ icon: "error", title: "Error", text: e?.message ?? "Ocurrió un error" })
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-[#E6E1D6] bg-white/90 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#E6E1D6] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[#2E321B]">Usuarios</h2>
            <p className="mt-1 text-sm text-gray-600">
              Recuerda que no se pueden cambiar roles (solo al crear).
            </p>
          </div>

          <div className="pt-1">
            <ActionButtons showCreate onCreate={() => setOpenCreate(true)} />
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <UsersTable
            rows={rows}
            loading={loading}
            onDeactivate={onDeactivate}
            onActivate={onActivate}
          />
        </div>
      </div>

      <CreateUserDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={async (payload) => {
          try {
            await m.create.mutateAsync(payload)
            await Swal.fire({ icon: "success", title: "Usuario creado" })
            setOpenCreate(false)
          } catch (e: any) {
            await Swal.fire({ icon: "error", title: "Error", text: e?.message ?? "Ocurrió un error" })
          }
        }}
      />

    </>
  )
}
