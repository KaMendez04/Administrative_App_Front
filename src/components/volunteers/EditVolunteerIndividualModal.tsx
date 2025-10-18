import React, { useState } from "react";
import type { VoluntarioIndividual } from "../../schemas/volunteerSchemas";
import apiConfig from "../../services/apiConfig";
import {
  showSuccessAlertRegister,
  showErrorAlertRegister,
  showConfirmAlert,
} from "../../utils/alerts";

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

  const inputClass =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-[#5B732E] focus:bg-white";
  const textareaClass =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-[#5B732E] focus:bg-white resize-none";
  const label =
    "block text-[11px] font-semibold text-[#556B2F] uppercase tracking-wide mb-1";
  const readOnlyStyle =
    "bg-gray-100 text-gray-500 border-dashed border-gray-300 cursor-not-allowed opacity-80";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleCancel = async () => {
    const confirm = await showConfirmAlert(
      "¿Está seguro?",
      "Los cambios no guardados se perderán."
    );
    if (confirm) {
      onClose();
    }
  };

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
                    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 12);
                    setFormData({ ...formData, telefono: onlyDigits });
                  }}
                  placeholder="Ej. 8888-8888"
                  className={inputClass}
                  maxLength={12}
                  minLength={8}
                  required
                />
              </div>
              <div>
                <label className={label} htmlFor="email">
                  Correo *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="correo@ejemplo.com"
                  className={inputClass}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={label} htmlFor="direccion">
                  Dirección
                </label>
                <input
                  id="direccion"
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  placeholder="Ej. San José, 100m norte de..."
                  className={inputClass}
                  maxLength={255}
                />
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
                  onChange={(e) =>
                    setFormData({ ...formData, nacionalidad: e.target.value })
                  }
                  placeholder="Ej. Costarricense"
                  className={inputClass}
                  maxLength={100}
                  required
                />
              </div>

              {/* Motivación */}
              <div>
                <label className={label} htmlFor="motivacion">
                  Motivación *
                </label>
                <textarea
                  id="motivacion"
                  value={formData.motivacion}
                  onChange={(e) =>
                    setFormData({ ...formData, motivacion: e.target.value })
                  }
                  placeholder="¿Por qué desea ser voluntario?"
                  className={textareaClass}
                  rows={3}
                  maxLength={500}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.motivacion.length}/500 caracteres
                </p>
              </div>

              {/* Habilidades */}
              <div>
                <label className={label} htmlFor="habilidades">
                  Habilidades *
                </label>
                <textarea
                  id="habilidades"
                  value={formData.habilidades}
                  onChange={(e) =>
                    setFormData({ ...formData, habilidades: e.target.value })
                  }
                  placeholder="Describa sus habilidades relevantes"
                  className={textareaClass}
                  rows={3}
                  maxLength={500}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.habilidades.length}/500 caracteres
                </p>
              </div>

              {/* Experiencia */}
              <div>
                <label className={label} htmlFor="experiencia">
                  Experiencia *
                </label>
                <textarea
                  id="experiencia"
                  value={formData.experiencia}
                  onChange={(e) =>
                    setFormData({ ...formData, experiencia: e.target.value })
                  }
                  placeholder="Describa su experiencia previa como voluntario"
                  className={textareaClass}
                  rows={3}
                  maxLength={500}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.experiencia.length}/500 caracteres
                </p>
              </div>
            </div>
          </section>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-5 border-t border-[#E6E1D6]">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[#5B732E] hover:bg-[#4a5c25] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}