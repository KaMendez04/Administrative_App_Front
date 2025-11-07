import React from "react"
import type { PersonalPageType } from "../../models/PersonalPageType"
import { personalApi } from "../../services/personalPageService"
import { useEditPersonalPageModal } from "../../hooks/Personal/useEditPersonalPageModal"
import { showSuccessAlertRegister, showErrorAlertRegister, showConfirmAlert } from "../../utils/alerts";

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
  const inputClass =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-[#A3853D] focus:bg-white";
  const label =
    "block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide mb-1";
  const readOnlyStyle =
    "bg-gray-100 text-gray-500 border-dashed border-gray-300 cursor-not-allowed opacity-80 select-none";

  const todayISO = () => new Date().toISOString().slice(0, 10);

  // TanStack Form + validadores (extraídos al hook)
  const { form, validators } = useEditPersonalPageModal(personalPage)


const pad = (n: number) => String(n).padStart(2, "0");
const formatYMD = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayStr = formatYMD(new Date());

// Fecha límite nacimiento: 31 dic del año pasado (no permite fechas de este año)
const currentYear = new Date().getFullYear();
const maxBirthDate = `${currentYear - 1}-12-31`;

// Fecha límite: hoy menos 18 años (nacidos en esta fecha o antes)
const cutoff = new Date();
cutoff.setFullYear(cutoff.getFullYear() - 18);
const cutoffStr = cutoff.toISOString().split("T")[0];

// Fecha sugerida para el calendario: hace exactamente 18 años
const defaultBirthDate = cutoffStr;

// Para startWorkDate: no puede ser hoy (máximo ayer)
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = formatYMD(yesterday);


  // ===== PASO 2: Normalizador del payload (sin cambiar diseño/lógica) =====
  const normalizePayload = (formData: PersonalPageType, base: any) => ({
    ...base,
    startWorkDate:
      formData.startWorkDate && formData.startWorkDate.trim() !== ""
        ? formData.startWorkDate
        : undefined,
    endWorkDate: formData.isActive
      ? null
      : (formData.endWorkDate && formData.endWorkDate.trim() !== ""
          ? formData.endWorkDate
          : todayISO()),
  })
  // =======================================================================

  // Submit (misma lógica, solo integramos normalizePayload y alerts)
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await form.handleSubmit()

    const { id, IdUser, ...rest } = personalPage as any
    let payload: any = { ...rest }

    // Normaliza fechas antes de enviar (PASO 2)
    payload = normalizePayload(personalPage, payload)

    try {
      if (isNew) {
        await personalApi.create(payload)
        // éxito crear
        await showSuccessAlertRegister("Registrado correctamente")
      } else {
        const realId = id ?? IdUser
        if (!realId) {
          console.error("No hay id para actualizar")
          return
        }
        // Mantienes tu regla: no se actualizan los identificadores en edición
        delete payload.IDE
        delete payload.name
        delete payload.lastname1
        delete payload.lastname2

        await personalApi.update(realId, payload)
        // éxito actualizar
        await showSuccessAlertRegister("Cambios guardados correctamente")
      }

      onSaved?.()
      setPersonalPage(null)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (isNew ? "No se pudo registrar." : "No se pudieron guardar los cambios.")
      await showErrorAlertRegister(msg)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#FAF9F5] border border-[#E6E1D6] rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-5 border-b border-[#E6E1D6] bg-white/60">
          <h2 className="text-xl font-bold text-[#374321]">
            {isNew ? "Registrar nuevo personal" : "Editar información"}
          </h2>
        </div>

        <form
          onSubmit={onSubmit}
          className="px-6 py-6 space-y-6 overflow-y-auto flex-1"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Identificación */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">Identificación</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Cédula */}
              <form.Field name="IDE">
                {(fieldApi) => (
                  <div>
                    <label className={label} htmlFor="ide">Cédula</label>
                    <input
                      id="ide"
                      type="text"
                      placeholder="Número de cédula"
                      value={personalPage.IDE ?? ""}
                      disabled={!isNew}
                      readOnly={!isNew}
                      title={!isNew ? "Este campo no se puede modificar al editar" : undefined}
                      onChange={async (e) => {
                        if (!isNew) return
                        const IDE = e.target.value.replace(/[-\s]/g, "")
                        fieldApi.handleChange(IDE)
                        let next = { ...personalPage, IDE }
                        if (IDE.length >= 9) {
                          const r = await lookup(IDE).catch(() => null)
                          if (r) {
                            next = {
                              ...next,
                              name: r.firstname ?? next.name ?? "",
                              lastname1: r.lastname1 ?? next.lastname1 ?? "",
                              lastname2: r.lastname2 ?? next.lastname2 ?? "",
                            }
                          }
                        }
                        setPersonalPage(next)
                      }}
                      className={`${inputClass} ${!isNew ? readOnlyStyle : ""}`}
                    />
                    {!isNew && (
                      <p className="mt-1 text-xs text-gray-500">
                        La cédula es un identificador y no puede modificarse al editar.
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Nombre */}
              <form.Field name="name" validators={validators.name}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div>
                      <label className={label} htmlFor="name">Nombre</label>
                      <input
                        id="name"
                        type="text"
                        value={personalPage.name ?? ""}
                        disabled={!isNew}
                        readOnly={!isNew}
                        aria-disabled={!isNew}
                        onChange={(e) => {
                          setPersonalPage({ ...personalPage, name: e.target.value })
                          fieldApi.handleChange(e.target.value)
                        }}
                        placeholder="Nombre"
                        className={`${inputClass} ${!isNew ? readOnlyStyle : ""}`}
                        required
                      />
                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                      {!isNew && (
                        <p className="mt-1 text-xs text-gray-500">
                          El nombre no se puede modificar en edición.
                        </p>
                      )}
                    </div>
                  )
                }}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Primer apellido */}
              <form.Field name="lastname1" validators={validators.lastname1}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div>
                      <label className={label} htmlFor="lastname1">Primer apellido</label>
                      <input
                        id="lastname1"
                        type="text"
                        disabled={!isNew}
                        readOnly={!isNew}
                        aria-disabled={!isNew}
                        value={personalPage.lastname1 ?? ""}
                        onChange={(e) => {
                          setPersonalPage({ ...personalPage, lastname1: e.target.value })
                          fieldApi.handleChange(e.target.value)
                        }}
                        placeholder="Primer apellido"
                        className={`${inputClass} ${!isNew ? readOnlyStyle : ""}`}
                        required
                      />
                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                      {!isNew && (
                        <p className="mt-1 text-xs text-gray-500">
                          El primer apellido no se puede modificar en edición.
                        </p>
                      )}
                    </div>
                  )
                }}
              </form.Field>

              {/* Segundo apellido */}
              <form.Field name="lastname2" validators={validators.lastname2}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div>
                      <label className={label} htmlFor="lastname2">Segundo apellido</label>
                      <input
                        id="lastname2"
                        type="text"
                        disabled={!isNew}
                        readOnly={!isNew}
                        aria-disabled={!isNew}
                        value={personalPage.lastname2 ?? ""}
                        onChange={(e) => {
                          setPersonalPage({ ...personalPage, lastname2: e.target.value })
                          fieldApi.handleChange(e.target.value)
                        }}
                        placeholder="Segundo apellido"
                        className={`${inputClass} ${!isNew ? readOnlyStyle : ""}`}
                        required
                      />
                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                      {!isNew && (
                        <p className="mt-1 text-xs text-gray-500">
                          El segundo apellido no se puede modificar en edición.
                        </p>
                      )}
                    </div>
                  )
                }}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de nacimiento */}
                <form.Field name="birthDate" validators={validators.birthDate}>
                  {(fieldApi) => {
                    const err = fieldApi.state.meta.errors[0]
                    return (
                      <div>
                        <label className={label} htmlFor="birthdate">Fecha de nacimiento</label>
                        <input
                          id="birthdate"
                          type="date"
                          value={personalPage.birthDate ?? ""}
                          min="1900-01-01"
                          max={cutoffStr}
                          defaultValue={!personalPage.birthDate ? defaultBirthDate : undefined}
                          onChange={(e) => {
                            const v = e.target.value
                            // Bloquear fechas fuera del rango igual que en fechas de trabajo
                            if (v && (v < '1900-01-01' || v > cutoffStr)) {
                              e.target.value = personalPage.birthDate ?? '';
                              return;
                            }
                            setPersonalPage({ ...personalPage, birthDate: v })
                            fieldApi.handleChange(v)
                          }}
                          className={inputClass}
                          required
                        />
                        {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                        <p className="mt-1 text-xs text-gray-500">
                          Debe tener al menos 18 años cumplidos. (Máximo: {cutoffStr})
                        </p>
                      </div>
                    )
                  }}
                </form.Field>

              <div />
            </div>
          </section>

          {/* Contacto y Datos */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">Contacto y Datos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <form.Field name="email" validators={validators.email}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div>
                      <label className={label} htmlFor="email">Correo</label>
                      <input
                        id="email"
                        type="email"
                        value={personalPage.email ?? ""}
                        onChange={(e) => {
                          setPersonalPage({ ...personalPage, email: e.target.value })
                          fieldApi.handleChange(e.target.value)
                        }}
                        placeholder="correo@dominio.com"
                        className={inputClass}
                      />
                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                    </div>
                  )
                }}
              </form.Field>

              {/* Teléfono */}
              <form.Field name="phone" validators={validators.phone}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div>
                      <label className={label} htmlFor="phone">Teléfono</label>
                      <input
                        id="phone"
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        pattern="\d{8}"
                        value={personalPage.phone ?? ""}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 8)
                          setPersonalPage({ ...personalPage, phone: onlyDigits })
                          fieldApi.handleChange(onlyDigits)
                        }}
                        placeholder="Ej. 8888-8888"
                        className={inputClass}
                        required
                      />
                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                    </div>
                  )
                }}
              </form.Field>

              {/* Dirección */}
              <form.Field name="direction" validators={validators.direction}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div className="md:col-span-2">
                      <label className={label} htmlFor="direction">Dirección</label>
                      <input
                        id="direction"
                        type="text"
                        value={personalPage.direction ?? ""}
                        onChange={(e) => {
                          setPersonalPage({ ...personalPage, direction: e.target.value })
                          fieldApi.handleChange(e.target.value)
                        }}
                        placeholder="Distrito, cantón, provincia…"
                        className={inputClass}
                        required
                      />
                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                    </div>
                  )
                }}
              </form.Field>
            </div>
          </section>

          {/* Perfil laboral y Estado */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">Perfil laboral y Estado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ocupación */}
              <form.Field name="occupation" validators={validators.occupation}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div className="md:col-span-2">
                      <label className={label} htmlFor="occupation">Ocupación</label>
                      <input
                        id="occupation"
                        type="text"
                        value={personalPage.occupation ?? ""}
                        onChange={(e) => {
                          setPersonalPage({ ...personalPage, occupation: e.target.value })
                          fieldApi.handleChange(e.target.value)
                        }}
                        placeholder="Puesto / rol"
                        className={inputClass}
                        required
                      />
                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                    </div>
                  )
                }}
              </form.Field>

              {/* Estado */}
              <form.Field name="isActive">
                {(fieldApi) => (
                  <div>
                    <label className={label} htmlFor="isActive">Estado</label>
                    <select
                      id="isActive"
                      value={personalPage.isActive ? "activo" : "inactivo"}
                      onChange={(e) => {
                        const v = e.target.value === "activo"
                        // si cambia a inactivo y no hay fecha fin, auto-coloca hoy; si vuelve a activo, limpia
                        setPersonalPage({
                          ...personalPage,
                          isActive: v,
                          endWorkDate: v ? null : (personalPage.endWorkDate && personalPage.endWorkDate.trim() !== "" ? personalPage.endWorkDate : todayISO()),
                        })
                        fieldApi.handleChange(v)
                      }}
                      className={inputClass}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                )}
              </form.Field>
            </div>

            {/* Fechas laborales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Fecha de inicio laboral */}
              <form.Field name="startWorkDate" validators={validators.startWorkDate}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div>
                      <label className={label} htmlFor="startWorkDate">Fecha de inicio laboral</label>
                      <input
                        id="startWorkDate"
                        type="date"
                        value={personalPage.startWorkDate ?? ""}
                        min="1925-01-01"    // ✅ Fecha mínima histórica
                        max={yesterdayStr}  // ✅ Máximo ayer (bloquea hoy y futuro en calendario)
                        onChange={(e) => {
                          const v = e.target.value
                          if (v && v >= todayStr) return  // ⛔ Bloquear hoy o futuro

                          // Si ya había endWorkDate, verificar que start sea al menos 1 día antes
                          let nextEnd = personalPage.endWorkDate ?? ""
                          if (nextEnd && v) {
                            const startDate = new Date(v)
                            const endDate = new Date(nextEnd)
                            const dayAfterStart = new Date(startDate)
                            dayAfterStart.setDate(dayAfterStart.getDate() + 1)
                            
                            // Si end no es al menos 1 día después, limpiar
                            if (endDate <= startDate) {
                              nextEnd = ""
                            }
                          }

                          setPersonalPage({ ...personalPage, startWorkDate: v, endWorkDate: nextEnd })
                          fieldApi.handleChange(v)
                        }}
                        placeholder="YYYY-MM-DD"
                        className={inputClass}
                      />
                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                      <p className="mt-1 text-xs text-gray-500">
                        Debe ser anterior a hoy.
                      </p>
                    </div>
                  )
                }}
              </form.Field>


              {/* Fecha de salida */}
              <form.Field name="endWorkDate" validators={validators.endWorkDate}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  const start = personalPage.startWorkDate ?? ""
                  
                  // Calcular mínimo: al menos 1 día después del inicio
                  let minEndDate = "1925-01-01"
                  if (start) {
                    const startDate = new Date(start)
                    startDate.setDate(startDate.getDate() + 1)
                    minEndDate = formatYMD(startDate)
                  }
                  
                  return (
                    <div>
                      <label className={label} htmlFor="endWorkDate">Fecha de salida</label>
                      <input
                        id="endWorkDate"
                        type="date"
                        value={personalPage.endWorkDate ?? ""}
                        min={minEndDate}  // ✅ Al menos 1 día después del inicio (bloquea días no válidos)
                        onChange={(e) => {
                          if (personalPage.isActive) return
                          const v = e.target.value
                          
                          // Verificar que sea al menos 1 día después del inicio
                          if (start && v) {
                            const startDate = new Date(start)
                            const endDate = new Date(v)
                            
                            // ⛔ Bloquear si es el mismo día o anterior
                            if (endDate <= startDate) return
                          }
                          
                          setPersonalPage({ ...personalPage, endWorkDate: v })
                          fieldApi.handleChange(v)
                        }}
                        placeholder="YYYY-MM-DD"
                        className={`${inputClass} ${personalPage.isActive ? readOnlyStyle : ""}`}
                        readOnly={personalPage.isActive}
                        disabled={personalPage.isActive}
                      />
                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                      {start && !personalPage.isActive && (
                        <p className="mt-1 text-xs text-gray-500">
                          Debe ser al menos 1 día después de la fecha de inicio.
                        </p>
                      )}
                    </div>
                  )
                }}
              </form.Field>

              <div className="hidden md:block" />
            </div>
          </section>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-5 border-t border-[#E6E1D6]">
            <button
              type="button"
              onClick={async () => {
                const confirm = await showConfirmAlert(
                  "¿Está seguro?",
                  "Está a punto de cancelar la acción. Los datos no se guardarán."
                );
                if (confirm) {
                  setPersonalPage(null);
                }
              }}
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
