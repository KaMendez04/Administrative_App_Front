import { getUsers } from "@/services/Settings/UsersService"
import { useQuery } from "@tanstack/react-query"

export function useUsers() {
  return useQuery({
    queryKey: ["settings", "users"],
    queryFn: getUsers,
  })
}
