import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import type { User } from "@/models/settings/User"
import { GenericTable } from "@/components/GenericTable"
import { Switch } from "../ui/switch"

type Props = {
  rows: User[]
  loading?: boolean
  onDeactivate: (id: number) => void
  onActivate: (id: number) => void
}

export default function UsersTable({
  rows,
  loading = false,
  onDeactivate,
  onActivate,
}: Props) {
  const columns = useMemo<ColumnDef<User, any>[]>(() => {
    return [
      {
        accessorKey: "username",
        header: "Usuario",
        cell: (info) => (
          <span className="font-semibold text-[#2E321B]">
            {String(info.getValue() ?? "")}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => (
          <span className="text-[#2E321B]">{String(info.getValue() ?? "")}</span>
        ),
      },
      {
        id: "role",
        header: "Rol",
        accessorFn: (row) => row.role?.name ?? "",
        cell: (info) => {
          const role = String(info.getValue() ?? "")
          if(role === "ADMIN") {
            return (
              <span className="inline-flex items-center rounded-full border border-[#EAEFE0] bg-[#F8F9F3] px-3 py-1 text-xs font-bold text-[#5B732E]">
                {role}
              </span>
            )
          }
          return (
            <span className="inline-flex items-center rounded-full border border-[#faeece] 
            bg-[#FEF6E0] px-3 py-1 text-xs font-bold text-[#A3853D]">
              {role}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const u = row.original
          const active = !!u.isActive

          return (
            <div className="flex items-center justify-center gap-3">
              <Switch
                checked={active}
                onCheckedChange={(checked) => {
                  if (checked) onActivate(u.id)
                  else onDeactivate(u.id)
                }}
                className={[
                  // tamaño (track)
                  "h-6 w-11",
                  // colores del track
                  "data-[state=checked]:bg-[#6f8c3ec0] data-[state=unchecked]:bg-[#d4c5a5]",
                  "border border-[#CFC8B8]",
                  "shadow-sm",
                  "[&_[data-slot=switch-thumb]]:h-5 [&_[data-slot=switch-thumb]]:w-5",
                  "[&_[data-slot=switch-thumb]]:bg-[#f3eee4]",
                  "[&_[data-slot=switch-thumb]]:shadow",
                ].join(" ")}
              />

              <span
                className={[
                  "text-xs font-semibold",
                  active ? "text-[#5B732E]" : "text-gray-500",
                ].join(" ")}
              >
                {active ? "Activo" : "Inactivo"}
              </span>
            </div>
          )
        },
      },
    ]
  }, [onActivate, onDeactivate])

  return <GenericTable<User> data={rows} columns={columns} isLoading={loading} />
}
