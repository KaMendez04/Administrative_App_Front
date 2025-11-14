import React, { useState } from "react";
import type { VoluntarioIndividual } from "../../schemas/volunteerSchemas";
import apiConfig from "../../services/apiConfig";
import {
  showSuccessAlertRegister,
  showErrorAlertRegister,
} from "../../utils/alerts";
import { useZodValidation } from "../../hooks/Volunteers/useZodValidation";
import { UpdateVoluntarioIndividualSchema } from "../../schemas/updateVolunteerSchema";
import Swal from "sweetalert2";
import { useToggleVolunteerStatus } from "../../hooks/Volunteers/individual/useToggleVolunteerStatus";
import { ActionButtons } from "../../components/ActionButtons";

interface EditVolunteerIndividualModalProps {
  voluntario: VoluntarioIndividual;
  onClose: () => void;
  onSaved?: () => void;
}

export function EditVolunteerIndividualModal({
  voluntario,
  onClose,
  onSaved,
}: EditVolunteerIndividualModalProps) {
  const [formData, setFormData] = useState({
    telefono: voluntario.persona.telefono || "",
    email: voluntario.persona.email || "",
    direccion: voluntario.persona.direccion || "",
    motivacion: voluntario.motivacion || "",
    habilidades: voluntario.habilidades || "",
    experiencia: voluntario.experiencia || "",
    nacionalidad: voluntario.nacionalidad || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, validateField, validateAll } = useZodValidation(
    UpdateVoluntarioIndividualSchema
  );
  const toggleStatus = useToggleVolunteerStatus();

  const inputClass =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-[#5B732E] focus:bg-white";
  const textareaClass =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-[#5B732E] focus:bg-white resize-none";
  const label =
    "block text-[11px] font-semibold text-[#556B2F] uppercase tracking-wide mb-1";
  const readOnlyStyle =
    "bg-gray-100 text-gray-500 border-dashed border-gray-300 cursor-not-allowed opacity-80";
  const errorClass = "border-red-500 focus:border-red-500";
  const errorText = "text-xs text-red-600 mt-1";

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    validateField(field, value);
  };

  const handleToggleClick = async () => {
    const currentStatus = voluntario.isActive ?? false;
    
    const result = await Swal.fire({
      title: currentStatus ? '¿Desactivar voluntario?' : '¿Activar voluntario?',
      html: currentStatus 
        ? `Estás a punto de <span style="color: #dc2626; font-weight: 600;">desactivar</span> a <span style="color: #33361D; font-weight: 600;">${voluntario.persona.nombre} ${voluntario.persona.apellido1}</span>. El voluntario no podrá acceder a la plataforma hasta que sea reactivado.`
        : `Estás a punto de <span style="color: #16a34a; font-weight: 600;">activar</span> a <span style="color: #33361D; font-weight: 600;">${voluntario.persona.nombre} ${voluntario.persona.apellido1}</span>. El voluntario podrá acceder a la plataforma.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus ? '#dc2626' : '#5B732E',
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
      await toggleStatus.mutateAsync(voluntario.idVoluntario);
      onSaved?.();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todo antes de enviar
    if (!validateAll(formData)) {
      await showErrorAlertRegister("Por favor corrige los errores en el formulario");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiConfig.patch(
        `/voluntarios-individuales/${voluntario.idVoluntario}`,
        formData
      );

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

  const currentStatus = voluntario.isActive ?? false;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#FAF9F5] border border-[#E6E1D6] rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E1D6] bg-white/60">
          <h2 className="text-xl font-bold text-[#374321]">
            Editar Información del Voluntario
          </h2>
          <p className="text-sm text-[#556B2F] mt-1">
            {voluntario.persona.nombre} {voluntario.persona.apellido1}{" "}
            {voluntario.persona.apellido2}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 space-y-6 overflow-y-auto flex-1"
        >
          {/* ✅ TOGGLE DE ESTADO */}
          <div className="rounded-xl bg-[#F8F9F3] p-4 border-2 border-[#EAEFE0]">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-[#33361D] mb-1">
                  Estado del Voluntario
                </label>
                <p className="text-xs text-gray-600">
                  {currentStatus ? "El voluntario está activo y puede acceder" : "El voluntario está inactivo"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleClick}
                disabled={toggleStatus.isPending}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
                  ${currentStatus ? "bg-[#5B732E]" : "bg-gray-300"}
                  ${toggleStatus.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}
                `}
                aria-label={currentStatus ? "Desactivar voluntario" : "Activar voluntario"}
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

          {/* Información Personal (Solo lectura) */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#556B2F]">
              Información Personal (No editable)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={label}>Cédula</label>
                <input
                  type="text"
                  value={voluntario.persona.cedula}
                  className={`${inputClass} ${readOnlyStyle}`}
                  readOnly
                  disabled
                />
              </div>
              <div>
                <label className={label}>Nombre Completo</label>
                <input
                  type="text"
                  value={`${voluntario.persona.nombre} ${voluntario.persona.apellido1} ${voluntario.persona.apellido2}`}
                  className={`${inputClass} ${readOnlyStyle}`}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </section>

          {/* Contacto (Editable) */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#556B2F]">
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={label} htmlFor="telefono">
                  Teléfono *
                </label>
                <input
                  id="telefono"
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 20);
                    handleChange("telefono", onlyDigits);
                  }}
                  placeholder="Ej. 8888-8888"
                  className={`${inputClass} ${errors.telefono ? errorClass : ""}`}
                  maxLength={20}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.telefono && (
                    <p className={errorText}>{errors.telefono}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.telefono.length}/20 caracteres
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
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={`${inputClass} ${errors.email ? errorClass : ""}`}
                  disabled={isSubmitting}
                />
                {errors.email && <p className={errorText}>{errors.email}</p>}
              </div>
              <div className="md:col-span-2">
                <label className={label} htmlFor="direccion">
                  Dirección
                </label>
                <input
                  id="direccion"
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  placeholder="Ej. San José, 100m norte de..."
                  className={`${inputClass} ${errors.direccion ? errorClass : ""}`}
                  maxLength={200}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.direccion && (
                    <p className={errorText}>{errors.direccion}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.direccion.length}/200 caracteres
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Información del Voluntariado (Editable) */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#556B2F]">
              Información del Voluntariado
            </h3>

            <div className="space-y-4">
              {/* Nacionalidad */}
              <div>
                <label className={label} htmlFor="nacionalidad">
                  Nacionalidad *
                </label>
                <input
                  id="nacionalidad"
                  type="text"
                  value={formData.nacionalidad}
                  onChange={(e) => handleChange("nacionalidad", e.target.value)}
                  placeholder="Ej. Costarricense"
                  className={`${inputClass} ${
                    errors.nacionalidad ? errorClass : ""
                  }`}
                  maxLength={60}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.nacionalidad && (
                    <p className={errorText}>{errors.nacionalidad}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.nacionalidad.length}/60 caracteres
                  </p>
                </div>
              </div>

              {/* Motivación */}
              <div>
                <label className={label} htmlFor="motivacion">
                  Motivación *
                </label>
                <textarea
                  id="motivacion"
                  value={formData.motivacion}
                  onChange={(e) => handleChange("motivacion", e.target.value)}
                  placeholder="¿Por qué desea ser voluntario?"
                  className={`${textareaClass} ${
                    errors.motivacion ? errorClass : ""
                  }`}
                  rows={3}
                  maxLength={150}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.motivacion && (
                    <p className={errorText}>{errors.motivacion}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.motivacion.length}/150 caracteres
                  </p>
                </div>
              </div>

              {/* Habilidades */}
              <div>
                <label className={label} htmlFor="habilidades">
                  Habilidades *
                </label>
                <textarea
                  id="habilidades"
                  value={formData.habilidades}
                  onChange={(e) => handleChange("habilidades", e.target.value)}
                  placeholder="Describa sus habilidades relevantes"
                  className={`${textareaClass} ${
                    errors.habilidades ? errorClass : ""
                  }`}
                  rows={3}
                  maxLength={150}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.habilidades && (
                    <p className={errorText}>{errors.habilidades}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.habilidades.length}/150 caracteres
                  </p>
                </div>
              </div>

              {/* Experiencia */}
              <div>
                <label className={label} htmlFor="experiencia">
                  Experiencia
                </label>
                <textarea
                  id="experiencia"
                  value={formData.experiencia}
                  onChange={(e) => handleChange("experiencia", e.target.value)}
                  placeholder="Describa su experiencia previa como voluntario"
                  className={`${textareaClass} ${
                    errors.experiencia ? errorClass : ""
                  }`}
                  rows={3}
                  maxLength={150}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.experiencia && (
                    <p className={errorText}>{errors.experiencia}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.experiencia.length}/150 caracteres
                  </p>
                </div>
              </div>
            </div>
          </section>

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
              disabled={Object.keys(errors).length > 0}
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