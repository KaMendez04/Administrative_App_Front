import React, { useState } from "react";
import apiConfig from "../../../apiConfig/apiConfig";
import { showErrorAlertRegister, showSuccessAlertRegister } from "../../../utils/alerts";
import type { Organizacion } from "../../../schemas/volunteerSchemas";
import { UpdateOrganizacionSchema, UpdateRepresentanteSchema } from "../../../schemas/updateVolunteerSchema";
import { useZodValidation } from "../../../hooks/Volunteers/useZodValidation";
import Swal from "sweetalert2";
import { useToggleOrganizacionStatus } from "../../../hooks/Volunteers/organizations/useToggleOrganizationStatus";
import { ActionButtons } from "../../../components/ActionButtons";

interface EditOrganizationModalProps {
  organizacion: Organizacion;
  onClose: () => void;
  onSaved?: () => void;
}

export function EditOrganizationModal({
  organizacion,
  onClose,
  onSaved,
}: EditOrganizationModalProps) {
  const [orgFormData, setOrgFormData] = useState({
    numeroVoluntarios: organizacion.numeroVoluntarios || 0,
    direccion: organizacion.direccion || "",
    telefono: organizacion.telefono || "",
    email: organizacion.email || "",
  });

  const [representantesData, setRepresentantesData] = useState(
    organizacion.representantes?.map((rep) => ({
      idRepresentante: rep.idRepresentante,
      cargo: rep.cargo || "",
      nombre: rep.persona.nombre || "",
      apellido1: rep.persona.apellido1 || "",
      apellido2: rep.persona.apellido2 || "",
      telefono: rep.persona.telefono || "",
      email: rep.persona.email || "",
      direccion: rep.persona.direccion || "",
    })) || []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validaciones para organización
  const {
    errors: orgErrors,
    validateField: validateOrgField,
    validateAll: validateOrgAll,
  } = useZodValidation(UpdateOrganizacionSchema);

  // Validaciones para representantes
  const [repErrors, setRepErrors] = useState<Record<number, Record<string, string>>>({});

  // Hook para toggle de estado
  const toggleStatus = useToggleOrganizacionStatus();

  const inputClass =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-[#8C3A33] focus:bg-white";
  const label =
    "block text-[11px] font-semibold text-[#8C3A33] uppercase tracking-wide mb-1";
  const readOnlyStyle =
    "bg-gray-100 text-gray-500 border-dashed border-gray-300 cursor-not-allowed opacity-80";
  const errorClass = "border-red-500 focus:border-red-500";
  const errorText = "text-xs text-red-600 mt-1";

  const handleOrgChange = (field: string, value: string | number) => {
    setOrgFormData({ ...orgFormData, [field]: value });
    validateOrgField(field, value);
  };

  const validateRepField = (index: number, field: string, value: any) => {
    try {
      // Si el campo está vacío y es opcional (telefono, email, direccion), no validar
      const optionalFields = ['telefono', 'email', 'direccion'];
      if (optionalFields.includes(field) && (!value || value === "")) {
        setRepErrors((prev) => {
          const newErrors = { ...prev };
          if (newErrors[index]) {
            delete newErrors[index][field];
            if (Object.keys(newErrors[index]).length === 0) {
              delete newErrors[index];
            }
          }
          return newErrors;
        });
        return;
      }

      const testData = { [field]: value };
      const result = UpdateRepresentanteSchema.safeParse(testData);
      
      if (result.success) {
        setRepErrors((prev) => {
          const newErrors = { ...prev };
          if (newErrors[index]) {
            delete newErrors[index][field];
            if (Object.keys(newErrors[index]).length === 0) {
              delete newErrors[index];
            }
          }
          return newErrors;
        });
      } else {
        const fieldError = result.error.issues.find(
          (issue) => issue.path[0] === field
        );
        
        if (fieldError) {
          setRepErrors((prev) => ({
            ...prev,
            [index]: {
              ...prev[index],
              [field]: fieldError.message,
            },
          }));
        }
      }
    } catch (err: any) {
      console.error("Error validando representante:", err);
    }
  };

  const updateRepresentante = (index: number, field: string, value: string | number) => {
    const updated = [...representantesData];
    updated[index] = { ...updated[index], [field]: value };
    setRepresentantesData(updated);
    validateRepField(index, field, value);
  };

  const handleToggleClick = async () => {
    const currentStatus = organizacion.isActive ?? false;
    
    const result = await Swal.fire({
      title: currentStatus ? '¿Desactivar organización?' : '¿Activar organización?',
      html: currentStatus 
        ? `Estás a punto de <span style="color: #dc2626; font-weight: 600;">desactivar</span> a <span style="color: #33361D; font-weight: 600;">${organizacion.nombre}</span>. La organización no podrá acceder a la plataforma hasta que sea reactivada.`
        : `Estás a punto de <span style="color: #16a34a; font-weight: 600;">activar</span> a <span style="color: #33361D; font-weight: 600;">${organizacion.nombre}</span>. La organización podrá acceder a la plataforma.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus ? '#dc2626' : '#8C3A33',
      cancelButtonColor: '#dc2626',
      confirmButtonText: currentStatus ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      reverseButtons: false,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl px-6 py-3 font-semibold',
        cancelButton: 'rounded-xl px-6 py-3 font-semibold',
      }
    });

    if (result.isConfirmed) {
      await toggleStatus.mutateAsync(organizacion.idOrganizacion);
      onSaved?.();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOrgAll(orgFormData)) {
      await showErrorAlertRegister("Por favor corrige los errores en la información de la organización");
      return;
    }

    let allRepsValid = true;
    const newRepErrors: Record<number, Record<string, string>> = {};
    
    representantesData.forEach((rep, index) => {
      const result = UpdateRepresentanteSchema.safeParse(rep);
      if (!result.success) {
        allRepsValid = false;
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          errors[field] = issue.message;
        });
        newRepErrors[index] = errors;
      }
    });

    if (!allRepsValid) {
      setRepErrors(newRepErrors);
      await showErrorAlertRegister("Por favor corrige los errores en los representantes");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiConfig.patch(
        `/organizaciones/${organizacion.idOrganizacion}`,
        orgFormData
      );

      for (const rep of representantesData) {
        await apiConfig.patch(`/representantes/${rep.idRepresentante}`, {
          cargo: rep.cargo,
          nombre: rep.nombre,
          apellido1: rep.apellido1,
          apellido2: rep.apellido2,
          telefono: rep.telefono,
          email: rep.email,
          direccion: rep.direccion,
        });
      }

      await showSuccessAlertRegister("Información actualizada correctamente");
      onSaved?.();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudieron guardar los cambios.";
      await showErrorAlertRegister(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasErrors = Object.keys(orgErrors).length > 0 || Object.keys(repErrors).length > 0;
  const currentStatus = organizacion.isActive ?? false;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#FAF9F5] border border-[#E6E1D6] rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E1D6] bg-white/60">
          <h2 className="text-xl font-bold text-[#374321]">
            Editar Información de la Organización
          </h2>
          <p className="text-sm text-[#8C3A33] mt-1">
            {organizacion.nombre}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 space-y-6 overflow-y-auto flex-1"
        >
          {/* TOGGLE DE ESTADO */}
          <div className="rounded-xl bg-[#F8F9F3] p-4 border-2 border-[#EAEFE0]">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-[#33361D] mb-1">
                  Estado de la Organización
                </label>
                <p className="text-xs text-gray-600">
                  {currentStatus ? "La organización está activa y puede acceder" : "La organización está inactiva"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleClick}
                disabled={toggleStatus.isPending}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
                  ${currentStatus ? "bg-[#8C3A33]" : "bg-gray-300"}
                  ${toggleStatus.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}
                `}
                aria-label={currentStatus ? "Desactivar organización" : "Activar organización"}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out
                    ${currentStatus ? "translate-x-6" : "translate-x-1"}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Información de la Organización (Solo lectura) */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#8C3A33]">
              Información General (No editable)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={label}>Cédula Jurídica</label>
                <input
                  type="text"
                  value={organizacion.cedulaJuridica}
                  className={`${inputClass} ${readOnlyStyle}`}
                  readOnly
                  disabled
                />
              </div>
              <div>
                <label className={label}>Nombre</label>
                <input
                  type="text"
                  value={organizacion.nombre}
                  className={`${inputClass} ${readOnlyStyle}`}
                  readOnly
                  disabled
                />
              </div>
              <div>
                <label className={label}>Tipo de Organización</label>
                <input
                  type="text"
                  value={organizacion.tipoOrganizacion}
                  className={`${inputClass} ${readOnlyStyle}`}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </section>

          {/* Información Editable de la Organización */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#8C3A33]">
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={label} htmlFor="numeroVoluntarios">
                  Número de Voluntarios *
                </label>
                <input
                  id="numeroVoluntarios"
                  type="text"
                  value={orgFormData.numeroVoluntarios}
                  onChange={(e) =>
                    handleOrgChange("numeroVoluntarios", parseInt(e.target.value) || 0)
                  }
                  placeholder="Ej. 10"
                  className={`${inputClass} ${
                    orgErrors.numeroVoluntarios ? errorClass : ""
                  }`}
                  min={1}
                  disabled={isSubmitting}
                />
                {orgErrors.numeroVoluntarios && (
                  <p className={errorText}>{orgErrors.numeroVoluntarios}</p>
                )}
              </div>
              <div>
                <label className={label} htmlFor="telefono">
                  Teléfono 
                </label>
                <input
                  id="telefono"
                  type="text"
                  value={orgFormData.telefono}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 20);
                    handleOrgChange("telefono", onlyDigits);
                  }}
                  placeholder="Ej. 8888-8888"
                  className={`${inputClass} ${orgErrors.telefono ? errorClass : ""}`}
                  maxLength={20}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                  {orgErrors.telefono && (
                    <p className={errorText}>{orgErrors.telefono}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {orgFormData.telefono.length}/20 caracteres
                  </p>
                </div>
              </div>
              <div>
                <label className={label} htmlFor="email">
                  Correo *
                </label>
                <input
                  id="email"
                  type="email"
                  value={orgFormData.email}
                  onChange={(e) => handleOrgChange("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={`${inputClass} ${orgErrors.email ? errorClass : ""}`}
                  maxLength={100}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                  {orgErrors.email && <p className={errorText}>{orgErrors.email}</p>}
                  <p className="text-xs text-gray-500 ml-auto">
                    {orgFormData.email.length}/100 caracteres
                  </p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={label} htmlFor="direccion">
                  Dirección
                </label>
                <input
                  id="direccion"
                  type="text"
                  value={orgFormData.direccion}
                  onChange={(e) => handleOrgChange("direccion", e.target.value)}
                  placeholder="Ej. San José, 100m norte de..."
                  className={`${inputClass} ${orgErrors.direccion ? errorClass : ""}`}
                  maxLength={200}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                  {orgErrors.direccion && (
                    <p className={errorText}>{orgErrors.direccion}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {orgFormData.direccion.length}/200 caracteres
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Representantes */}
          {representantesData.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#8C3A33]">
                Representantes
              </h3>
              <div className="space-y-4">
                {representantesData.map((rep, index) => (
                  <div
                    key={rep.idRepresentante}
                    className="border border-[#E6E1D6] rounded-xl p-4 bg-white/50"
                  >
                    <h4 className="font-semibold text-[#374321] mb-3">
                      Representante #{index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nombre */}
                      <div>
                        <label className={label}>Nombre *</label>
                        <input
                          type="text"
                          value={rep.nombre}
                          onChange={(e) =>
                            updateRepresentante(index, "nombre", e.target.value)
                          }
                          placeholder="Ej. Juan"
                          className={`${inputClass} ${
                            repErrors[index]?.nombre ? errorClass : ""
                          }`}
                          maxLength={60}
                          disabled={isSubmitting}
                        />
                        <div className="flex justify-between items-center mt-1">
                          {repErrors[index]?.nombre && (
                            <p className={errorText}>{repErrors[index].nombre}</p>
                          )}
                          <p className="text-xs text-gray-500 ml-auto">
                            {rep.nombre.length}/60 caracteres
                          </p>
                        </div>
                      </div>

                      {/* Primer Apellido */}
                      <div>
                        <label className={label}>Primer Apellido *</label>
                        <input
                          type="text"
                          value={rep.apellido1}
                          onChange={(e) =>
                            updateRepresentante(index, "apellido1", e.target.value)
                          }
                          placeholder="Ej. Pérez"
                          className={`${inputClass} ${
                            repErrors[index]?.apellido1 ? errorClass : ""
                          }`}
                          maxLength={60}
                          disabled={isSubmitting}
                        />
                        <div className="flex justify-between items-center mt-1">
                          {repErrors[index]?.apellido1 && (
                            <p className={errorText}>{repErrors[index].apellido1}</p>
                          )}
                          <p className="text-xs text-gray-500 ml-auto">
                            {rep.apellido1.length}/60 caracteres
                          </p>
                        </div>
                      </div>

                      {/* Segundo Apellido */}
                      <div>
                        <label className={label}>Segundo Apellido *</label>
                        <input
                          type="text"
                          value={rep.apellido2}
                          onChange={(e) =>
                            updateRepresentante(index, "apellido2", e.target.value)
                          }
                          placeholder="Ej. García"
                          className={`${inputClass} ${
                            repErrors[index]?.apellido2 ? errorClass : ""
                          }`}
                          maxLength={60}
                          disabled={isSubmitting}
                        />
                        <div className="flex justify-between items-center mt-1">
                          {repErrors[index]?.apellido2 && (
                            <p className={errorText}>{repErrors[index].apellido2}</p>
                          )}
                          <p className="text-xs text-gray-500 ml-auto">
                            {rep.apellido2.length}/60 caracteres
                          </p>
                        </div>
                      </div>

                      {/* Cargo */}
                      <div>
                        <label className={label}>Cargo *</label>
                        <input
                          type="text"
                          value={rep.cargo}
                          onChange={(e) =>
                            updateRepresentante(index, "cargo", e.target.value)
                          }
                          placeholder="Ej. Presidente"
                          className={`${inputClass} ${
                            repErrors[index]?.cargo ? errorClass : ""
                          }`}
                          maxLength={100}
                          disabled={isSubmitting}
                        />
                        <div className="flex justify-between items-center mt-1">
                          {repErrors[index]?.cargo && (
                            <p className={errorText}>{repErrors[index].cargo}</p>
                          )}
                          <p className="text-xs text-gray-500 ml-auto">
                            {rep.cargo.length}/100 caracteres
                          </p>
                        </div>
                      </div>

                      {/* Teléfono */}
                      <div>
                        <label className={label}>Teléfono</label>
                        <input
                          type="text"
                          value={rep.telefono}
                          onChange={(e) => {
                            const onlyDigits = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 20);
                            updateRepresentante(index, "telefono", onlyDigits);
                          }}
                          placeholder="Ej. 8888-8888"
                          className={`${inputClass} ${
                            repErrors[index]?.telefono ? errorClass : ""
                          }`}
                          maxLength={20}
                          disabled={isSubmitting}
                        />
                        <div className="flex justify-between items-center mt-1">
                          {repErrors[index]?.telefono && (
                            <p className={errorText}>{repErrors[index].telefono}</p>
                          )}
                          <p className="text-xs text-gray-500 ml-auto">
                            {rep.telefono.length}/20 caracteres
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className={label}>Correo</label>
                        <input
                          type="email"
                          value={rep.email}
                          onChange={(e) =>
                            updateRepresentante(index, "email", e.target.value)
                          }
                          placeholder="correo@ejemplo.com"
                          className={`${inputClass} ${
                            repErrors[index]?.email ? errorClass : ""
                          }`}
                          maxLength={60}
                          disabled={isSubmitting}
                        />
                        <div className="flex justify-between items-center mt-1">
                          {repErrors[index]?.email && (
                            <p className={errorText}>{repErrors[index].email}</p>
                          )}
                          <p className="text-xs text-gray-500 ml-auto">
                            {rep.email.length}/60 caracteres
                          </p>
                        </div>
                      </div>

                      {/* Dirección */}
                      <div className="md:col-span-2">
                        <label className={label}>Dirección</label>
                        <input
                          type="text"
                          value={rep.direccion}
                          onChange={(e) =>
                            updateRepresentante(index, "direccion", e.target.value)
                          }
                          placeholder="Ej. San José, 100m norte de..."
                          className={`${inputClass} ${
                            repErrors[index]?.direccion ? errorClass : ""
                          }`}
                          maxLength={200}
                          disabled={isSubmitting}
                        />
                        <div className="flex justify-between items-center mt-1">
                          {repErrors[index]?.direccion && (
                            <p className={errorText}>{repErrors[index].direccion}</p>
                          )}
                          <p className="text-xs text-gray-500 ml-auto">
                            {rep.direccion.length}/200 caracteres
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer con ActionButtons */}
          <div className="flex justify-end pt-5 border-t border-[#E6E1D6]">
            <ActionButtons
              onCancel={onClose}
              onSave={() => {}}
              showCancel={true}
              showSave={true}
              showText={true}
              saveButtonType="submit"
              isSaving={isSubmitting}
              disabled={hasErrors}
              requireConfirmCancel={true}
              cancelConfirmTitle="¿Está seguro?"
              cancelConfirmText="Los cambios no guardados se perderán."
              saveText="Guardar cambios"
              cancelText="Cancelar"
            />
          </div>
        </form>
      </div>
    </div>
  );
}