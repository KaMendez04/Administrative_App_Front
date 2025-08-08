import { Plus, Pencil } from "lucide-react"
import { useMemo, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"

interface Staff {
  IdUser: number
  IDE: string
  name: string
  lastname1: string
  lastname2: string
  birthdate: string
  phone: string
  email: string
  direction: string
  occupation: string
  isActive: boolean
}

const staffList: Staff[] = [
  {
    IdUser: 1,
    IDE: "509870567",
    name: "Greilyn",
    lastname1: "Esquivel",
    lastname2: "Salazar",
    birthdate: "1995-06-20",
    phone: "60345678",
    email: "greilyn@ejemplo.com",
    direction: "Nicoya",
    occupation: "Secretaria",
    isActive: true,
  },
  {
    IdUser: 2,
    IDE: "501230654",
    name: "Angélica",
    lastname1: "Ortiz",
    lastname2: "Barrantes",
    birthdate: "1992-04-10",
    phone: "84558012",
    email: "angelica@ejemplo.com",
    direction: "Santa Cruz",
    occupation: "Administradora",
    isActive: false,
  },
  {
    IdUser: 3,
    IDE: "504500674",
    name: "Katheryn",
    lastname1: "Méndez",
    lastname2: "Quirós",
    birthdate: "1990-09-12",
    phone: "12345678",
    email: "katheryn@ejemplo.com",
    direction: "Hojancha",
    occupation: "Contadora",
    isActive: false,
  },
  {
    IdUser: 4,
    IDE: "507890123",
    name: "Krystel",
    lastname1: "Salazar",
    lastname2: "Chavarría",
    birthdate: "1993-11-01",
    phone: "65432109",
    email: "krystel@ejemplo.com",
    direction: "Liberia",
    occupation: "Coordinadora",
    isActive: true,
  },
  {
    IdUser: 5,
    IDE: "503456789",
    name: "Marvin",
    lastname1: "Méndez",
    lastname2: "Cruz",
    birthdate: "1991-01-15",
    phone: "71234567",
    email: "marvin@ejemplo.com",
    direction: "Carrillo",
    occupation: "Soporte Técnico",
    isActive: false,
  },
]

export default function StaffManagementPage() {
  const [search, setSearch] = useState("")
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [editStaff, setEditStaff] = useState<Staff | null>(null)
  const [newStaff, setNewStaff] = useState<Staff | null>(null)

  const filtered = useMemo(() => {
    return staffList.filter((s) =>
      `${s.name} ${s.lastname1} ${s.lastname2} ${s.IDE}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [search])

  const columns = useMemo<ColumnDef<Staff>[]>(() => [
    {
      header: "Nombre",
      cell: (info) => info.row.original.name,
    },
    {
      header: "Primer Apellido",
      cell: (info) => info.row.original.lastname1,
    },
    {
      header: "Segundo Apellido",
      cell: (info) => info.row.original.lastname2,
    },
    {
      header: "Cédula",
      cell: (info) => info.row.original.IDE,
    },
    {
      header: "Teléfono",
      cell: (info) => info.row.original.phone,
    },
    {
      header: "Puesto",
      cell: (info) => info.row.original.occupation,
    },
    {
      header: "Información Adicional",
      cell: (info) => (
        <button
          onClick={() => setSelectedStaff(info.row.original)}
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
            onClick={() => setEditStaff(info.row.original)}
            className="p-2 bg-[#EEF4D8] hover:bg-[#E7EDC8] text-[#708C3E] rounded-md transition duration-200 hover:scale-105 shadow-sm"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], [])

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] px-6 py-10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#374321]">Gestión del Personal</h1>
          <button
            onClick={() =>
              setNewStaff({
                IdUser: Date.now(),
                IDE: "",
                name: "",
                lastname1: "",
                lastname2: "",
                birthdate: "",
                phone: "",
                email: "",
                direction: "",
                occupation: "",
                isActive: true,
              })
            }
            className="bg-[#708C3E] hover:bg-[#5e7630] text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110"
            aria-label="Agregar nuevo personal"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o cédula"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 px-6 py-3 rounded-lg shadow-sm text-base bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A3853D]"
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="min-w-full divide-y divide-gray-200 text-base">
            <thead className="bg-[#EEF4D8] text-[#374321]">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="font-semibold text-center">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-5 py-4">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[#f1f1f1] text-gray-800 text-center">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-[#F9FAF6] transition duration-200">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStaff && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-[#374321] mb-4">Información adicional</h2>
            <p><span className="font-semibold">Nombre completo:</span> {selectedStaff.name} {selectedStaff.lastname1} {selectedStaff.lastname2}</p>
            <p><span className="font-semibold">Cédula:</span> {selectedStaff.IDE}</p>
            <p><span className="font-semibold">Fecha de nacimiento:</span> {selectedStaff.birthdate}</p>
            <p><span className="font-semibold">Ubicación:</span> {selectedStaff.direction}</p>
            {selectedStaff.email && <p><span className="font-semibold">Correo:</span> {selectedStaff.email}</p>}
            <p className="mt-2">
              <span className="font-semibold">Estado:</span>{" "}
              <span className={`ml-1 px-3 py-1.5 rounded-full text-sm font-semibold ${selectedStaff.isActive ? "bg-green-100 text-[#4D7031]" : "bg-red-100 text-red-700"}`}>
                {selectedStaff.isActive ? "Activo" : "Inactivo"}
              </span>
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 bg-[#708C3E] hover:bg-[#5e7630] text-white rounded-md shadow"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {editStaff && (
        <EditStaffModal staff={editStaff} setStaff={setEditStaff} />
      )}

      {newStaff && (
        <EditStaffModal staff={newStaff} setStaff={setNewStaff} isNew />
      )}
    </div>
  )
}

function EditStaffModal({
  staff,
  setStaff,
  isNew = false,
}: {
  staff: Staff
  setStaff: (s: Staff | null) => void
  isNew?: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xl">
        <h2 className="text-xl font-bold text-[#374321] mb-4">
          {isNew ? "Registrar nuevo personal" : "Editar información"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log(isNew ? "Nuevo personal:" : "Actualizado:", staff)
            setStaff(null)
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={staff.name} onChange={(e) => setStaff({ ...staff, name: e.target.value })} placeholder="Nombre" className="border border-gray-300 px-4 py-2 rounded-md" required />
            <input type="text" value={staff.lastname1} onChange={(e) => setStaff({ ...staff, lastname1: e.target.value })} placeholder="Primer apellido" className="border border-gray-300 px-4 py-2 rounded-md" required />
            <input type="text" value={staff.lastname2} onChange={(e) => setStaff({ ...staff, lastname2: e.target.value })} placeholder="Segundo apellido" className="border border-gray-300 px-4 py-2 rounded-md" required />
            <input type="text" value={staff.IDE} onChange={(e) => setStaff({ ...staff, IDE: e.target.value })} placeholder="Cédula" className="border border-gray-300 px-4 py-2 rounded-md" required />
            <input type="date" value={staff.birthdate} onChange={(e) => setStaff({ ...staff, birthdate: e.target.value })} className="border border-gray-300 px-4 py-2 rounded-md" required />
            <input type="text" value={staff.phone} onChange={(e) => setStaff({ ...staff, phone: e.target.value })} placeholder="Teléfono" className="border border-gray-300 px-4 py-2 rounded-md" required />
            <input type="text" value={staff.direction} onChange={(e) => setStaff({ ...staff, direction: e.target.value })} placeholder="Dirección" className="border border-gray-300 px-4 py-2 rounded-md" required />
            <input type="text" value={staff.occupation} onChange={(e) => setStaff({ ...staff, occupation: e.target.value })} placeholder="Ocupación" className="border border-gray-300 px-4 py-2 rounded-md" required />
            <input type="email" value={staff.email} onChange={(e) => setStaff({ ...staff, email: e.target.value })} placeholder="Correo" className="border border-gray-300 px-4 py-2 rounded-md" />
            <select value={staff.isActive ? "activo" : "inactivo"} onChange={(e) => setStaff({ ...staff, isActive: e.target.value === "activo" })} className="border border-gray-300 px-4 py-2 rounded-md">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setStaff(null)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-[#708C3E] hover:bg-[#5e7630] text-white rounded-md shadow">
              {isNew ? "Registrar" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
