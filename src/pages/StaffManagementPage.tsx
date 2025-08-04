import { useState } from "react"

interface Staff {
  id: number
  name: string
  lastName1: string
  lastName2: string
  idNumber: string
  location: string
  phone: string
  position: string
  isActive: boolean
}

export default function StaffManagementPage() {
  const [search, setSearch] = useState("")

  const staffList: Staff[] = [
    {
      id: 1,
      name: "Greilyn",
      lastName1: "Esquivel",
      lastName2: "Salazar",
      idNumber: "509870567",
      location: "Nicoya",
      phone: "60345678",
      position: "Secretaria",
      isActive: true,
    },
    {
      id: 2,
      name: "Angélica",
      lastName1: "Ortiz",
      lastName2: "Barrantes",
      idNumber: "501230654",
      location: "Santa Cruz",
      phone: "84558012",
      position: "Administradora",
      isActive: false,
    },
    {
      id: 3,
      name: "Katheryn",
      lastName1: "Méndez",
      lastName2: "Quirós",
      idNumber: "504500674",
      location: "Hojancha",
      phone: "12345678",
      position: "Contadora",
      isActive: false,
    },
    {
      id: 4,
      name: "Krystel",
      lastName1: "Salazar",
      lastName2: "Chavarría",
      idNumber: "507890123",
      location: "Liberia",
      phone: "65432109",
      position: "Coordinadora",
      isActive: true,
    },
    {
      id: 5,
      name: "Marvin",
      lastName1: "Méndez",
      lastName2: "Cruz",
      idNumber: "503456789",
      location: "Carrillo",
      phone: "71234567",
      position: "Soporte Técnico",
      isActive: false,
    },
  ]

  const filtered = staffList.filter((s) =>
    `${s.name} ${s.lastName1} ${s.lastName2}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#374321]">Gestión del Personal</h1>
          <button className="bg-[#708C3E] hover:bg-[#5e7630] text-white rounded-full w-11 h-11 flex items-center justify-center text-2xl shadow-md">
            +
          </button>
        </div>

        {/* Buscar */}
       {/* Buscar */}
<div className="mb-8">
  <input
    type="text"
    placeholder="Buscar por nombre o apellido"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full border border-gray-300 px-6 py-3 rounded-lg shadow-sm text-base bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A3853D]"
  />
</div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="min-w-full divide-y divide-gray-200 text-base">
            <thead className="bg-[#EEF4D8] text-[#374321]">
              <tr className="text-left font-semibold">
                <th className="px-5 py-4">Nombre</th>
                <th className="px-5 py-4">Primer Apellido</th>
                <th className="px-5 py-4">Segundo Apellido</th>
                <th className="px-5 py-4">Cédula</th>
                <th className="px-5 py-4">Ubicación</th>
                <th className="px-5 py-4">Teléfono</th>
                <th className="px-5 py-4">Puesto</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f1f1] text-gray-800">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#F9FAF6] transition duration-200">
                  <td className="px-5 py-4">{s.name}</td>
                  <td className="px-5 py-4">{s.lastName1}</td>
                  <td className="px-5 py-4">{s.lastName2}</td>
                  <td className="px-5 py-4 font-medium text-black">{s.idNumber}</td>
                  <td className="px-5 py-4">{s.location}</td>
                  <td className="px-5 py-4">{s.phone}</td>
                  <td className="px-5 py-4">{s.position}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                        s.isActive
                          ? "bg-green-100 text-[#4D7031]"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="bg-[#F2F2F2] hover:bg-[#e2e2e2] text-gray-800 px-5 py-2 rounded-md text-sm font-medium shadow">
                      Ver info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
