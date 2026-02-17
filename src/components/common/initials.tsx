import { getInitialsFromUsername } from "@/utils/initials"

export function UserAvatar({ username }: { username?: string | null }) {
  const initials = getInitialsFromUsername(username)

  return (
    <div className="h-14 w-14 rounded-full border border-[#E6E1D6] bg-black/5 flex items-center justify-center">
      <span className="text-sm font-semibold text-[#2E321B]">{initials}</span>
    </div>
  )
}
