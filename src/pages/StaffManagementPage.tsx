import { useState } from "react"


interface Staff {
  id: number
  fullName: string
  isActive: boolean
}

export default function StaffManagementPage() {
  const [search, setSearch] = useState("")

  const staffList: Staff[] = [
    { id: 1, fullName: "Greilyn Esquivel Salazar", isActive: true },
    { id: 2, fullName: "Angélica Ortiz Barrantes", isActive: false },
    { id: 3, fullName: "Katheryn Méndez Quirós", isActive: false },
    { id: 4, fullName: "Krystel Salazar Chavarría", isActive: true },
    { id: 5, fullName: "Marvin Méndez Cruz", isActive: false },
  ]

  const filteredStaff = staffList.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FAF9F5] via-[#EEF4D8] to-[#E7EDC8] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#333]">Gestión del Personal</h1>
          <button className="bg-green-600 hover:bg-green-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
            +
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl">🔍</span>
          <input
            type="text"
            placeholder="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 px-4 py-2 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        {/* Lista del personal */}
        <div className="flex flex-col gap-5">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="flex justify-between items-center bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-4 hover:shadow-md transition duration-300"
            >
              <span className="text-lg font-medium text-gray-800">{staff.fullName}</span>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium transition">
                  ver info
                </button>
                <span
                  className={`px-3 py-1.5 text-sm font-semibold rounded-md ${
                    staff.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {staff.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
