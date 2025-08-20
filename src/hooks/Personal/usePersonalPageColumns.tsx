import { useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import type { PersonalPageType } from "../../models/PersonalPageType"
import { Pencil } from "lucide-react"


interface UsePersonalPageColumnsProps {
  onView: (item: PersonalPageType) => void
  onEdit: (item: PersonalPageType) => void
}

export function usePersonalPageColumns({
  onView,
  onEdit,
}: UsePersonalPageColumnsProps) {
  return useMemo<ColumnDef<PersonalPageType>[]>(() => [
    { header: "Nombre",          cell: (info) => info.row.original.name },
    { header: "Primer Apellido", cell: (info) => info.row.original.lastname1 },
    { header: "Segundo Apellido",cell: (info) => info.row.original.lastname2 },
    { header: "Cédula",          cell: (info) => info.row.original.IDE },
    { header: "Teléfono",        cell: (info) => info.row.original.phone },
    { header: "Puesto",          cell: (info) => info.row.original.occupation },
    {
      header: "Información Adicional",
      cell: (info) => (
        <button
          onClick={() => onView(info.row.original)}
          className="bg-[#F2F2F2] hover:bg-[#e2e2e2] text-gray-800 px-5 py-2 rounded-md text-sm font-medium shadow"
        >
          Ver info
        </button>
      ),
    },
    {
      header: "Editar",
      cell: (info) => (
        <div className="flex justify-center">
          <button
            onClick={() => onEdit(info.row.original)}
            className="p-2 bg-[#EEF4D8] hover:bg-[#E7EDC8] text-[#708C3E] rounded-md transition duration-200 hover:scale-105 shadow-sm"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], [onView, onEdit])
}

export function useCedulaLookup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = async (cedula: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const persona = await fetchCedulaData(cedula)
      return persona
    } catch (err: any) {
      setError(err.message || "Error desconocido")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { lookup, isLoading, error }
}

function fetchCedulaData(cedula: string) {
  throw new Error("Function not implemented.")
}
