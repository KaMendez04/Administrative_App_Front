import type { PersonalPageType } from "../../models/PersonalPageType"

interface EditPersonalPageModalProps {
  personalPage: PersonalPageType
  setPersonalPage: (s: PersonalPageType | null) => void
  isNew?: boolean
}

export function EditPersonalPageModal({
  personalPage,
  setPersonalPage,
  isNew = false,
}: EditPersonalPageModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xl">
        <h2 className="text-xl font-bold text-[#374321] mb-4">
          {isNew ? "Registrar nuevo personal" : "Editar información"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log(isNew ? "Nuevo personal:" : "Actualizado:", personalPage)
            setPersonalPage(null)
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={personalPage.name}
              onChange={(e) => setPersonalPage({ ...personalPage, name: e.target.value })}
              placeholder="Nombre"
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="text"
              value={personalPage.lastname1}
              onChange={(e) => setPersonalPage({ ...personalPage, lastname1: e.target.value })}
              placeholder="Primer apellido"
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="text"
              value={personalPage.lastname2}
              onChange={(e) => setPersonalPage({ ...personalPage, lastname2: e.target.value })}
              placeholder="Segundo apellido"
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="text"
              value={personalPage.IDE}
              onChange={(e) => setPersonalPage({ ...personalPage, IDE: e.target.value })}
              placeholder="Cédula"
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="date"
              value={personalPage.birthdate}
              onChange={(e) => setPersonalPage({ ...personalPage, birthdate: e.target.value })}
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="text"
              value={personalPage.phone}
              onChange={(e) => setPersonalPage({ ...personalPage, phone: e.target.value })}
              placeholder="Teléfono"
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="text"
              value={personalPage.direction}
              onChange={(e) => setPersonalPage({ ...personalPage, direction: e.target.value })}
              placeholder="Dirección"
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="text"
              value={personalPage.occupation}
              onChange={(e) => setPersonalPage({ ...personalPage, occupation: e.target.value })}
              placeholder="Ocupación"
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="email"
              value={personalPage.email}
              onChange={(e) => setPersonalPage({ ...personalPage, email: e.target.value })}
              placeholder="Correo"
              className="border border-gray-300 px-4 py-2 rounded-md"
            />
            <select
              value={personalPage.isActive ? "activo" : "inactivo"}
              onChange={(e) =>
                setPersonalPage({ ...personalPage, isActive: e.target.value === "activo" })
              }
              className="border border-gray-300 px-4 py-2 rounded-md"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setPersonalPage(null)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#708C3E] hover:bg-[#5e7630] text-white rounded-md shadow"
            >
              {isNew ? "Registrar" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
