// src/components/Personal/EditPersonalPageModal.tsx
import React from "react"
import type { PersonalPageType } from "../../models/PersonalPageType"
import { personalApi } from "../../services/personalPageService"

interface EditPersonalPageModalProps {
  personalPage: PersonalPageType;
  setPersonalPage: React.Dispatch<React.SetStateAction<PersonalPageType | null>>;
  isNew?: boolean;
  onSaved?: () => void;
  lookup: (id: string) => Promise<any>;
}

export function EditPersonalPageModal({
  personalPage,
  setPersonalPage,
  isNew = false,
  onSaved,
  lookup,
}: EditPersonalPageModalProps) {
  const field =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-[#A3853D] focus:bg-white";
  const label =
    "block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide mb-1";

  const readOnlyStyle =
  "bg-gray-100 text-gray-500 border-dashed border-gray-300 cursor-not-allowed opacity-80 select-none";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  // UI -> API (no mandes id/IdUser en body)
  const { id, IdUser, ...rest } = personalPage as any;
  const payload: any = { ...rest }; // birthDate ya lo tienes en UI como tal

  if (isNew) {
    await personalApi.create(payload);
  } else {
    const realId = id ?? IdUser;           // ← usa la PK real del backend
    if (!realId) {
      console.error("No hay id para actualizar");
      return;
    }
    // si bloqueaste cédula/nombre/apellidos en edición, evita enviarlos:
    delete payload.IDE;
    delete payload.name;
    delete payload.lastname1;
    delete payload.lastname2;

    await personalApi.update(realId, payload);
  }

  onSaved?.();
  setPersonalPage(null);
}

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#FAF9F5] border border-[#E6E1D6] rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E6E1D6] bg-white/60">
          <h2 className="text-xl font-bold text-[#374321]">
            {isNew ? "Registrar nuevo personal" : "Editar información"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Identificación */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">Identificación</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={label} htmlFor="ide">
                    Cédula
                  </label>

                  <input
                    id="ide"
                    type="text"
                    placeholder="Número de cédula"
                    value={personalPage.IDE ?? ""}
                    disabled={!isNew}               // sigue bloqueando la edición
                    readOnly={!isNew}               // refuerza a11y
                    title={!isNew ? "Este campo no se puede modificar al editar" : undefined}
                    onChange={async (e) => {
                      if (!isNew) return; // no lookup en edición
                      const IDE = e.target.value.replace(/[-\s]/g, "");
                      let next = { ...personalPage, IDE };
                      if (IDE.length >= 9) {
                        const r = await lookup(IDE).catch(() => null);
                        if (r) {
                          next = {
                            ...next,
                            name: r.firstname ?? next.name ?? "",
                            lastname1: r.lastname1 ?? next.lastname1 ?? "",
                            lastname2: r.lastname2 ?? next.lastname2 ?? "",
                          };
                        }
                      }
                      setPersonalPage(next);
                    }}
                    className={`${field} ${!isNew ? readOnlyStyle : ""}`}
                  />

                  {!isNew && (
                    <p className="mt-1 text-xs text-gray-500">
                      La cédula es un identificador y no puede modificarse al editar.
                    </p>
                  )}
              </div>

              <div>
                <label className={label} htmlFor="name">
                  Nombre 
                </label>
                <input
                  id="name"
                  type="text"
                  value={personalPage.name ?? ""}
                  disabled={!isNew}
                  readOnly={!isNew}
                  aria-disabled={!isNew}
                  onChange={(e) => setPersonalPage({ ...personalPage, name: e.target.value })}
                  placeholder="Nombre"
                  className={`${field} ${!isNew ? readOnlyStyle : ""}`}
                  required
                />
                {!isNew && (
                  <p className="mt-1 text-xs text-gray-500">
                    El nombre no se puede modificar en edición.
                  </p>
                )}
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <div>
              <label className={label} htmlFor="lastname1">
                Primer apellido 
              </label>
              <input
                id="lastname1"
                type="text"
                disabled={!isNew}
                readOnly={!isNew}
                aria-disabled={!isNew}
                value={personalPage.lastname1 ?? ""}
                onChange={(e) => setPersonalPage({ ...personalPage, lastname1: e.target.value })}
                placeholder="Primer apellido"
                className={`${field} ${!isNew ? readOnlyStyle : ""}`}
                required
              />
              {!isNew && (
                <p className="mt-1 text-xs text-gray-500">
                  El primer apellido no se puede modificar en edición.
                </p>
              )}
            </div>
            <div>
              <label className={label} htmlFor="lastname2">
                Segundo apellido 
              </label>
              <input
                id="lastname2"
                type="text"
                disabled={!isNew}
                readOnly={!isNew}
                aria-disabled={!isNew}
                value={personalPage.lastname2 ?? ""}
                onChange={(e) => setPersonalPage({ ...personalPage, lastname2: e.target.value })}
                placeholder="Segundo apellido"
                className={`${field} ${!isNew ? readOnlyStyle : ""}`}
                required
              />
              {!isNew && (
                <p className="mt-1 text-xs text-gray-500">
                  El segundo apellido no se puede modificar en edición.
                </p>
              )}
            </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={label} htmlFor="birthdate">Fecha de nacimiento</label>
                <input
                  id="birthdate"
                  type="date"
                  value={personalPage.birthDate ?? ""}
                  onChange={(e) => setPersonalPage({ ...personalPage, birthDate: e.target.value })}
                  className={field}
                  required
                />
              </div>
              <div />
            </div>
          </section>

          {/* Contacto y Datos */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">Contacto y Datos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={label} htmlFor="email">Correo</label>
                <input
                  id="email"
                  type="email"
                  value={personalPage.email ?? ""}
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
                  value={personalPage.phone ?? ""}
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
                  value={personalPage.direction ?? ""}
                  onChange={(e) => setPersonalPage({ ...personalPage, direction: e.target.value })}
                  placeholder="Distrito, cantón, provincia…"
                  className={field}
                  required
                />
              </div>
            </div>
          </section>

          {/* Perfil laboral y Estado */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">Perfil laboral y Estado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className={label} htmlFor="occupation">Ocupación</label>
                <input
                  id="occupation"
                  type="text"
                  value={personalPage.occupation ?? ""}
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
                  onChange={(e) => setPersonalPage({ ...personalPage, isActive: e.target.value === "activo" })}
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
  );
}
