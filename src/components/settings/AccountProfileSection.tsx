import { useEffect, useMemo, useState } from "react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/auth/AuthProvider"
import { useUserMutations } from "@/hooks/settings/useUserMutations"
import { Pencil } from "lucide-react"

function getInitials(username?: string | null) {
  const u = (username ?? "").trim()
  if (!u) return "U"
  const letters = u.replace(/[^a-zA-Z0-9]/g, "")
  return (letters.slice(0, 2) || u.slice(0, 2)).toUpperCase()
}

function getAvatarColor(username?: string | null) {
  const colors = [
    { bg: "bg-[#E6EDC8]", text: "text-[#708C3E]" },
    { bg: "bg-[#F5E6C5]", text: "text-[#A3853D]" },
    { bg: "bg-[#d8e4c5]", text: "text-[#718f3d]" },
    { bg: "bg-[#A3853D]", text: "text-white" },
    { bg: "bg-[#E6E1D6]", text: "text-[#2E321B]" },
  ]

  const u = (username ?? "").trim()
  if (!u) return colors[0]

  let hash = 0
  for (let i = 0; i < u.length; i++) {
    const char = u.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }

  const index = Math.abs(hash) % colors.length
  return colors[index]
}

function UserAvatar({ username }: { username?: string | null }) {
  const initials = getInitials(username)
  const { bg, text } = getAvatarColor(username)
  return (
    <div className={`h-14 w-14 rounded-full border border-[#E6E1D6] ${bg} flex items-center justify-center`}>
      <span className={`text-sm font-semibold ${text}`}>{initials}</span>
    </div>
  )
}

export function AccountProfileSection() {
  const { user, updateUserSession } = useAuth() as any 
  const m = useUserMutations()

  const [editing, setEditing] = useState(false)
  const [usernameDraft, setUsernameDraft] = useState("")

  useEffect(() => {
    setUsernameDraft(user?.username ?? "")
  }, [user?.username])

  const canSave = useMemo(() => {
    const next = usernameDraft.trim()
    const current = (user?.username ?? "").trim()
    return !!user?.id && next.length > 0 && next !== current && !m.update.isPending
  }, [usernameDraft, user?.id, user?.username, m.update.isPending])

  const onStartEdit = () => setEditing(true)

  const onCancel = () => {
    setUsernameDraft(user?.username ?? "")
    setEditing(false)
  }

  const onSave = async () => {
    const username = usernameDraft.trim()
    if (!username || !user?.id) return

    try {
      const updated = await m.update.mutateAsync({ id: user.id, payload: { username } })

      updateUserSession(updated)

      setEditing(false)
      await Swal.fire({ icon: "success", title: "Username actualizado", timer: 1200, showConfirmButton: false })
    } catch (e: any) {
      await Swal.fire({ icon: "error", title: "Error", text: e?.message ?? "Ocurrió un error" })
    }
  }

  return (
    <section className="px-6 py-6">
      <div className="flex items-end gap-4">
        <UserAvatar username={user?.username} />

        <div className="min-w-0 flex-1">
          {/* Username row */}
          <div className="flex flex-wrap items-center gap-3">
            {!editing ? (
              <p className="text-base font-semibold text-[#2E321B] truncate">
                {user?.username ?? "Usuario"}
              </p>
            ) : (
              <div className="w-full max-w-sm">
                <label className="sr-only">Nombre del usuario</label>
                <Input
                  value={usernameDraft}
                  onChange={(e) => setUsernameDraft(e.target.value)}
                  className="border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0 rounded-md"
                  autoFocus
                />
              </div>
            )}

            {!editing ? (
              <Button
                type="button"
                variant="outline"
                onClick={onStartEdit}
                className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md  border border-none text-[#A3853D] text-sm font-medium hover:bg-[#F5E6C5] hover:text-[#8B6C2E]"
                >
                <Pencil className="w-5 h-5" />
            </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={onSave}
                  disabled={!canSave}
                  className="bg-[#708C3E] px-5 text-white hover:brightness-110"
                  size="sm"
                >
                  {m.update.isPending ? "Guardando..." : "Guardar"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={m.update.isPending}
                  className="border-[#E6E1D6]"
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>

          {/* Email */}
          <p className="mt-1 text-sm text-gray-600 truncate">{user?.email ?? ""}</p>
        </div>
      </div>
    </section>
  )
}
