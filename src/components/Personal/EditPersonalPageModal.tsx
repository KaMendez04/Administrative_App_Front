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
  const field =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-[#A3853D] focus:bg-white"

  const label =
    "block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide mb-1"

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#FAF9F5] border border-[#E6E1D6] rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E1D6] bg-white/60">
          <h2 className="text-xl font-bold text-[#374321]">
            {isNew ? "Registrar nuevo personal" : "Editar información"}
          </h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log(isNew ? "Nuevo personal:" : "Actualizado:", personalPage)
            setPersonalPage(null)
          }}
          className="px-6 py-6 space-y-6"
        >
          {/* Sección: Identificación */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Identificación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={label} htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={personalPage.name}
                  onChange={(e) => setPersonalPage({ ...personalPage, name: e.target.value })}
                  placeholder="Nombre"
                  className={field}
                  required
                />
              </div>
              <div>
                <label className={label} htmlFor="lastname1">Primer apellido</label>
                <input
                  id="lastname1"
                  type="text"
                  value={personalPage.lastname1}
                  onChange={(e) => setPersonalPage({ ...personalPage, lastname1: e.target.value })}
                  placeholder="Primer apellido"
                  className={field}
                  required
                />
              </div>
              <div>
                <label className={label} htmlFor="lastname2">Segundo apellido</label>
                <input
                  id="lastname2"
                  type="text"
                  value={personalPage.lastname2}
                  onChange={(e) => setPersonalPage({ ...personalPage, lastname2: e.target.value })}
                  placeholder="Segundo apellido"
                  className={field}
                  required
                />
              </div>

              <div>
                <label className={label} htmlFor="ide">Cédula</label>
                <input
                  id="ide"
                  type="text"
                  value={personalPage.IDE}
                  onChange={(e) => setPersonalPage({ ...personalPage, IDE: e.target.value })}
                  placeholder="Cédula"
                  className={field}
                  required
                />
              </div>
              <div>
                <label className={label} htmlFor="birthdate">Fecha de nacimiento</label>
                <input
                  id="birthdate"
                  type="date"
                  value={personalPage.birthdate}
                  onChange={(e) => setPersonalPage({ ...personalPage, birthdate: e.target.value })}
                  className={field}
                  required
                />
              </div>
              <div className="hidden md:block" />
            </div>
          </section>

          {/* Divider */}
          <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-[#E6E1D6] to-transparent" />

          {/* Sección: Contacto & Datos */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Contacto y Datos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={label} htmlFor="email">Correo</label>
                <input
                  id="email"
                  type="email"
                  value={personalPage.email}
                  onChange={(e) => setPersonalPage({ ...personalPage, email: e.target.value })}
                  placeholder="correo@dominio.com"
                  className={field}
                />
              </div>
              <div>
                <label className={label} htmlFor="phone">Teléfono</label>
                <input
                  id="phone"
                  type="text"
                  value={personalPage.phone}
                  onChange={(e) => setPersonalPage({ ...personalPage, phone: e.target.value })}
                  placeholder="Ej. 8888-8888"
                  className={field}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={label} htmlFor="direction">Dirección</label>
                <input
                  id="direction"
                  type="text"
                  value={personalPage.direction}
                  onChange={(e) => setPersonalPage({ ...personalPage, direction: e.target.value })}
                  placeholder="Distrito, cantón, provincia…"
                  className={field}
                  required
                />
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-[#E6E1D6] to-transparent" />

          {/* Sección: Perfil laboral & Estado */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Perfil laboral y Estado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className={label} htmlFor="occupation">Ocupación</label>
                <input
                  id="occupation"
                  type="text"
                  value={personalPage.occupation}
                  onChange={(e) => setPersonalPage({ ...personalPage, occupation: e.target.value })}
                  placeholder="Puesto / rol"
                  className={field}
                  required
                />
              </div>
              <div>
                <label className={label} htmlFor="isActive">Estado</label>
                <select
                  id="isActive"
                  value={personalPage.isActive ? "activo" : "inactivo"}
                  onChange={(e) =>
                    setPersonalPage({ ...personalPage, isActive: e.target.value === "activo" })
                  }
                  className={field}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-5 border-t border-[#E6E1D6]">
            <button
              type="button"
              onClick={() => setPersonalPage(null)}
              className="px-4 py-2 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#708C3E] hover:bg-[#5e7630] text-white font-medium shadow-md"
            >
              {isNew ? "Registrar" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
