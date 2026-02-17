import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  activateUser,
  createUser,
  deactivateUser,
  requestEmailChangeForUser,
  setUserPassword,
  updateUser,
} from "@/services/Settings/UsersService"

export function useUserMutations() {
  const qc = useQueryClient()

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: ["settings", "users"] })
  }

  return {
    create: useMutation({
      mutationFn: createUser,
      onSuccess: invalidate,
    }),

    update: useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: { username?: string } }) =>
        updateUser(id, payload),
      onSuccess: invalidate,
    }),

    setPassword: useMutation({
      mutationFn: ({ id, password }: { id: number; password: string }) =>
        setUserPassword(id, { password }),
      onSuccess: invalidate,
    }),

    deactivate: useMutation({
      mutationFn: (id: number) => deactivateUser(id),
      onSuccess: invalidate,
    }),

    activate: useMutation({
      mutationFn: (id: number) => activateUser(id),
      onSuccess: invalidate,
    }),

    requestEmailChange: useMutation({
      mutationFn: ({ id, newEmail }: { id: number; newEmail: string }) =>
        requestEmailChangeForUser(id, { id, newEmail }),
      onSuccess: invalidate,
    }),
  }
}
