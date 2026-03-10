import React from "react"
import type { PersonalPageType } from "../../models/PersonalPageType"
import { personalApi } from "../../services/personalPageService"
import { useEditPersonalPageModal } from "../../hooks/Personal/useEditPersonalPageModal"
import { showSuccessAlertRegister, showErrorAlertRegister } from "../../utils/alerts"
import { ActionButtons } from "../../components/ActionButtons"
import { BirthDatePicker } from "../ui/birthDayPicker"

interface EditPersonalPageModalProps {
  personalPage: PersonalPageType
  setPersonalPage: React.Dispatch<React.SetStateAction<PersonalPageType | null>>
  isNew?: boolean
  onSaved?: () => void
  lookup: (id: string) => Promise<any>
}

export function EditPersonalPageModal({
  personalPage,
  setPersonalPage,
  isNew = false,
  onSaved,
  lookup,
}: EditPersonalPageModalProps) {
  const [isSaving, setIsSaving] = React.useState(false)
  useLockBodyScroll(true);
  const inputClass =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-[#A3853D] focus:bg-white"
  const label =
    "block text-[11px] font-semibold text-[#708C3E] uppercase tracking-wide mb-1"
  const readOnlyStyle =
    "bg-gray-100 text-gray-500 border-dashed border-gray-300 cursor-not-allowed opacity-80 select-none"

  const selectButtonClass =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 text-sm outline-none transition focus:border-[#A3853D] focus:bg-white"

  const IDE_MAX = 20
  const NAME_MAX = 50
  const LASTNAME_MAX = 50
  const EMAIL_MAX = 75
  const PHONE_MAX = 8
  const DIRECTION_MAX = 100
  const OCCUPATION_MAX = 75

  const todayISO = () => new Date().toISOString().slice(0, 10)

  const statusOptions = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ]

  const { form, validators } = useEditPersonalPageModal(personalPage)

  const pad = (n: number) => String(n).padStart(2, "0")
  const formatYMD = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const todayStr = formatYMD(new Date())

  const cutoff = new Date()
  cutoff.setFullYear(cutoff.getFullYear() - 18)
  const cutoffStr = cutoff.toISOString().split("T")[0]

  const normalizePayload = (formData: PersonalPageType, base: any) => ({
    ...base,
    startWorkDate:
      formData.startWorkDate && formData.startWorkDate.trim() !== ""
        ? formData.startWorkDate
        : undefined,
    endWorkDate: formData.isActive
      ? null
      : formData.endWorkDate && formData.endWorkDate.trim() !== ""
        ? formData.endWorkDate
        : todayISO(),
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await form.handleSubmit()

    setIsSaving(true)
    const { id, IdUser, ...rest } = personalPage as any
    let payload: any = { ...rest }

    payload = normalizePayload(personalPage, payload)

    try {
      if (isNew) {
        await personalApi.create(payload)
        await showSuccessAlertRegister("Registrado correctamente")
      } else {
        const realId = id ?? IdUser
        if (!realId) {
          console.error("No hay id para actualizar")
          return
        }
        delete payload.IDE
        delete payload.name
        delete payload.lastname1
        delete payload.lastname2

        await personalApi.update(realId, payload)
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
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setPersonalPage(null)
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
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Identificación
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <form.Field name="IDE">
                {(fieldApi) => (
                  <div>
                    <label className={label} htmlFor="ide">
                      Cédula
                    </label>
                    <input
                      id="ide"
                      type="text"
                      placeholder="Número de cédula"
                      value={personalPage.IDE ?? ""}
                      maxLength={IDE_MAX}
                      disabled={!isNew || isSaving}
                      readOnly={!isNew}
                      title={!isNew ? "Este campo no se puede modificar al editar" : undefined}
                      onChange={async (e) => {
                        if (!isNew) return
                        const IDE = e.target.value.replace(/[-\s]/g, "").slice(0, IDE_MAX)
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
                    {isNew && <CharCounter value={personalPage.IDE ?? ""} max={IDE_MAX} />}
                    {!isNew && (
                      <p className="mt-1 text-xs text-gray-500">
                        La cédula es un identificador y no puede modificarse al editar.
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="name" validators={validators.name}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div>
                      <label className={label} htmlFor="name">
                        Nombre
                      </label>
                      <input
                        id="name"
                        type="text"
                        maxLength={NAME_MAX}
                        value={personalPage.name ?? ""}
                        disabled={!isNew || isSaving}
                        readOnly={!isNew}
                        aria-disabled={!isNew}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, NAME_MAX)
                          setPersonalPage({ ...personalPage, name: value })
                          fieldApi.handleChange(value)
                        }}
                        placeholder="Nombre"
                        className={`${inputClass} ${!isNew ? readOnlyStyle : ""}`}
                        required
                      />
                      {isNew && <CharCounter value={personalPage.name ?? ""} max={NAME_MAX} />}
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
              <form.Field name="lastname1" validators={validators.lastname1}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div>
                      <label className={label} htmlFor="lastname1">
                        Primer apellido
                      </label>
                      <input
                        id="lastname1"
                        type="text"
                        maxLength={LASTNAME_MAX}
                        disabled={!isNew || isSaving}
                        readOnly={!isNew}
                        aria-disabled={!isNew}
                        value={personalPage.lastname1 ?? ""}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, LASTNAME_MAX)
                          setPersonalPage({ ...personalPage, lastname1: value })
                          fieldApi.handleChange(value)
                        }}
                        placeholder="Primer apellido"
                        className={`${inputClass} ${!isNew ? readOnlyStyle : ""}`}
                        required
                      />
                      {isNew && <CharCounter value={personalPage.lastname1 ?? ""} max={LASTNAME_MAX} />}
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

              <form.Field name="lastname2" validators={validators.lastname2}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div>
                      <label className={label} htmlFor="lastname2">
                        Segundo apellido
                      </label>
                      <input
                        id="lastname2"
                        type="text"
                        maxLength={LASTNAME_MAX}
                        disabled={!isNew || isSaving}
                        readOnly={!isNew}
                        aria-disabled={!isNew}
                        value={personalPage.lastname2 ?? ""}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, LASTNAME_MAX)
                          setPersonalPage({ ...personalPage, lastname2: value })
                          fieldApi.handleChange(value)
                        }}
                        placeholder="Segundo apellido"
                        className={`${inputClass} ${!isNew ? readOnlyStyle : ""}`}
                        required
                      />
                      {isNew && <CharCounter value={personalPage.lastname2 ?? ""} max={LASTNAME_MAX} />}
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
              <form.Field name="birthDate" validators={validators.birthDate}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]

                  return (
                    <div>
                      <label className={label} htmlFor="birthdate">
                        Fecha de nacimiento
                      </label>

                      <BirthDatePicker
                        value={personalPage.birthDate ?? ""}
                        disabled={isSaving}
                        minAge={18}
                        placeholder="Seleccione una fecha"
                        error={err}
                        onChange={(v) => {
                          if (v && (v < "1900-01-01" || v > cutoffStr)) return
                          setPersonalPage({ ...personalPage, birthDate: v })
                          fieldApi.handleChange(v)
                        }}
                        className="w-full"
                      />

                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}

                      <p className="mt-1 text-xs text-gray-500">
                        Debe tener al menos 18 años cumplidos.
                      </p>
                    </div>
                  )
                }}
              </form.Field>

              <div />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Contacto y Datos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name="email" validators={validators.email}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div>
                      <label className={label} htmlFor="email">
                        Correo
                      </label>
                      <input
                        id="email"
                        type="email"
                        maxLength={EMAIL_MAX}
                        value={personalPage.email ?? ""}
                        disabled={isSaving}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, EMAIL_MAX)
                          setPersonalPage({ ...personalPage, email: value })
                          fieldApi.handleChange(value)
                        }}
                        placeholder="correo@dominio.com"
                        className={inputClass}
                      />
                      <CharCounter value={personalPage.email ?? ""} max={EMAIL_MAX} />
                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                    </div>
                  )
                }}
              </form.Field>

              <form.Field name="phone" validators={validators.phone}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  return (
                    <div>
                      <label className={label} htmlFor="phone">
                        Teléfono
                      </label>
                      <input
                        id="phone"
                        type="text"
                        inputMode="numeric"
                        maxLength={PHONE_MAX}
                        pattern="\d{8}"
                        value={personalPage.phone ?? ""}
                        disabled={isSaving}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, PHONE_MAX)
                          setPersonalPage({ ...personalPage, phone: onlyDigits })
                          fieldApi.handleChange(onlyDigits)
                        }}
                        placeholder="Ej. 8888-8888"
                        className={inputClass}
                        required
                      />
                      <CharCounter value={personalPage.phone ?? ""} max={PHONE_MAX} />
                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                    </div>
                  )
                }}
              </form.Field>

              <form.Field name="direction" validators={validators.direction}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  const directionValue = personalPage.direction ?? ""

                  return (
                    <div className="md:col-span-2">
                      <label className={label} htmlFor="direction">
                        Dirección
                      </label>

                      <input
                        id="direction"
                        type="text"
                        maxLength={DIRECTION_MAX}
                        value={directionValue}
                        disabled={isSaving}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, DIRECTION_MAX)
                          setPersonalPage({ ...personalPage, direction: value })
                          fieldApi.handleChange(value)
                        }}
                        placeholder="Distrito, cantón, provincia…"
                        className={inputClass}
                        required
                      />

                      <CharCounter value={directionValue} max={DIRECTION_MAX} />

                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                    </div>
                  )
                }}
              </form.Field>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#708C3E]">
              Perfil laboral y Estado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <form.Field name="occupation" validators={validators.occupation}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  const occupationValue = personalPage.occupation ?? ""

                  return (
                    <div className="md:col-span-2">
                      <label className={label} htmlFor="occupation">
                        Ocupación
                      </label>

                      <input
                        id="occupation"
                        type="text"
                        maxLength={OCCUPATION_MAX}
                        value={occupationValue}
                        disabled={isSaving}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, OCCUPATION_MAX)
                          setPersonalPage({ ...personalPage, occupation: value })
                          fieldApi.handleChange(value)
                        }}
                        placeholder="Puesto / rol"
                        className={inputClass}
                        required
                      />

                      <CharCounter value={occupationValue} max={OCCUPATION_MAX} />

                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                    </div>
                  )
                }}
              </form.Field>

              <form.Field name="isActive">
                {(fieldApi) => (
                  <div>
                    <label className={label} htmlFor="isActive">
                      Estado
                    </label>

                    <CustomSelect
                      value={personalPage.isActive ? "activo" : "inactivo"}
                      disabled={isSaving}
                      options={statusOptions}
                      size="md"
                      buttonClassName={selectButtonClass}
                      onChange={(value) => {
                        const v = value === "activo"

                        setPersonalPage({
                          ...personalPage,
                          isActive: v,
                          endWorkDate:
                            v
                              ? null
                              : personalPage.endWorkDate && personalPage.endWorkDate.trim() !== ""
                                ? personalPage.endWorkDate
                                : todayISO(),
                        })

                        fieldApi.handleChange(v)
                      }}
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <form.Field name="startWorkDate" validators={validators.startWorkDate}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]

                  return (
                    <div>
                      <label className={label} htmlFor="startWorkDate">
                        Fecha de inicio laboral
                      </label>

                      <BirthDatePicker
                        value={personalPage.startWorkDate ?? ""}
                        disabled={isSaving}
                        placeholder="Seleccione una fecha"
                        error={err}
                        minDate="1925-01-01"
                        helperText="Debe ser anterior a hoy."
                        triggerClassName={inputClass}
                        onChange={(v) => {
                          if (v && v >= todayStr) return

                          let nextEnd = personalPage.endWorkDate ?? ""
                          if (nextEnd && v) {
                            const startDate = new Date(v)
                            const endDate = new Date(nextEnd)

                            if (endDate <= startDate) {
                              nextEnd = ""
                            }
                          }

                          setPersonalPage({
                            ...personalPage,
                            startWorkDate: v,
                            endWorkDate: nextEnd,
                          })
                          fieldApi.handleChange(v)
                        }}
                      />

                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                    </div>
                  )
                }}
              </form.Field>

              <form.Field name="endWorkDate" validators={validators.endWorkDate}>
                {(fieldApi) => {
                  const err = fieldApi.state.meta.errors[0]
                  const start = personalPage.startWorkDate ?? ""

                  let minEndDate = "1925-01-01"
                  if (start) {
                    const startDate = new Date(start)
                    startDate.setDate(startDate.getDate() + 1)
                    minEndDate = formatYMD(startDate)
                  }

                  return (
                    <div>
                      <label className={label} htmlFor="endWorkDate">
                        Fecha de salida
                      </label>

                      <BirthDatePicker
                        value={personalPage.endWorkDate ?? ""}
                        disabled={personalPage.isActive || isSaving}
                        placeholder="Seleccione una fecha"
                        error={err}
                        minDate={minEndDate}
                        helperText={
                          start && !personalPage.isActive
                            ? "Debe ser al menos 1 día después de la fecha de inicio."
                            : undefined
                        }
                        triggerClassName={`${inputClass} ${personalPage.isActive ? readOnlyStyle : ""}`}
                        onChange={(v) => {
                          if (personalPage.isActive) return

                          if (start && v) {
                            const startDate = new Date(start)
                            const endDate = new Date(v)
                            if (endDate <= startDate) return
                          }

                          setPersonalPage({ ...personalPage, endWorkDate: v })
                          fieldApi.handleChange(v)
                        }}
                      />

                      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
                    </div>
                  )
                }}
              </form.Field>

              <div className="hidden md:block" />
            </div>
          </section>

          <div className="flex justify-end pt-5 border-t border-[#E6E1D6]">
            <ActionButtons
              onCancel={handleCancel}
              onSave={() => {}}
              showCancel={true}
              showSave={true}
              showText={true}
              saveButtonType="submit"
              isSaving={isSaving}
              requireConfirmCancel={true}
              cancelConfirmTitle="¿Está seguro?"
              cancelConfirmText="Está a punto de cancelar la acción. Los datos no se guardarán."
              saveText={isNew ? "Registrar" : "Guardar cambios"}
              cancelText="Cancelar"
            />
          </div>
        </form>
      </div>
    </div>
  )
}