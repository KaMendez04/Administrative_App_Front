export function getInitialsFromUsername(username?: string | null) {
  const u = (username ?? "").trim()
  if (!u) return "U"
  const letters = u.replace(/[^a-zA-Z0-9]/g, "")
  return (letters.slice(0, 2) || u.slice(0, 2)).toUpperCase()
}
