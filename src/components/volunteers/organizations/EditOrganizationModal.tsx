import React, { useState } from "react";
import apiConfig from "../../../services/apiConfig";
import { showConfirmAlert, showErrorAlertRegister, showSuccessAlertRegister } from "../../../utils/alerts";
import type { Organizacion } from "../../../schemas/volunteerSchemas";

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
      nombre: rep.persona.nombre || "", // ✅ Ahora editable
      apellido1: rep.persona.apellido1 || "", // ✅ Ahora editable
      apellido2: rep.persona.apellido2 || "", // ✅ Ahora editable
      telefono: rep.persona.telefono || "",
      email: rep.persona.email || "",
      direccion: rep.persona.direccion || "",
    })) || []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-[#8C3A33] focus:bg-white";
  const label =
    "block text-[11px] font-semibold text-[#8C3A33] uppercase tracking-wide mb-1";
  const readOnlyStyle =
    "bg-gray-100 text-gray-500 border-dashed border-gray-300 cursor-not-allowed opacity-80";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Actualizar organización
      await apiConfig.patch(
        `/organizaciones/${organizacion.idOrganizacion}`,
        orgFormData
      );

      // Actualizar representantes
      for (const rep of representantesData) {
        await apiConfig.patch(`/representantes/${rep.idRepresentante}`, {
          cargo: rep.cargo,
          nombre: rep.nombre, // ✅ Incluir nombre
          apellido1: rep.apellido1, // ✅ Incluir apellido1
          apellido2: rep.apellido2, // ✅ Incluir apellido2
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

  const handleCancel = async () => {
    const confirm = await showConfirmAlert(
      "¿Está seguro?",
      "Los cambios no guardados se perderán."
    );
    if (confirm) {
      onClose();
    }
  };

  const updateRepresentante = (index: number, field: string, value: string | number) => {
    const updated = [...representantesData];
    updated[index] = { ...updated[index], [field]: value };
    setRepresentantesData(updated);
  };

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
                  type="number"
                  value={orgFormData.numeroVoluntarios}
                  onChange={(e) =>
                    setOrgFormData({
                      ...orgFormData,
                      numeroVoluntarios: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Ej. 10"
                  className={inputClass}
                  min={1}
                  required
                />
              </div>
              <div>
                <label className={label} htmlFor="telefono">
                  Teléfono *
                </label>
                <input
                  id="telefono"
                  type="text"
                  value={orgFormData.telefono}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 15);
                    setOrgFormData({ ...orgFormData, telefono: onlyDigits });
                  }}
                  placeholder="Ej. 8888-8888"
                  className={inputClass}
                  maxLength={15}
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
                  value={orgFormData.email}
                  onChange={(e) =>
                    setOrgFormData({ ...orgFormData, email: e.target.value })
                  }
                  placeholder="correo@ejemplo.com"
                  className={inputClass}
                  maxLength={100}
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
                  value={orgFormData.direccion}
                  onChange={(e) =>
                    setOrgFormData({ ...orgFormData, direccion: e.target.value })
                  }
                  placeholder="Ej. San José, 100m norte de..."
                  className={inputClass}
                  maxLength={255}
                />
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
                      {/* ✅ Nombre (Ahora editable) */}
                      <div>
                        <label className={label}>Nombre *</label>
                        <input
                          type="text"
                          value={rep.nombre}
                          onChange={(e) =>
                            updateRepresentante(index, "nombre", e.target.value)
                          }
                          placeholder="Ej. Juan"
                          className={inputClass}
                          maxLength={100}
                          required
                        />
                      </div>

                      {/* ✅ Primer Apellido (Ahora editable) */}
                      <div>
                        <label className={label}>Primer Apellido *</label>
                        <input
                          type="text"
                          value={rep.apellido1}
                          onChange={(e) =>
                            updateRepresentante(index, "apellido1", e.target.value)
                          }
                          placeholder="Ej. Pérez"
                          className={inputClass}
                          maxLength={100}
                          required
                        />
                      </div>

                      {/* ✅ Segundo Apellido (Ahora editable) */}
                      <div>
                        <label className={label}>Segundo Apellido *</label>
                        <input
                          type="text"
                          value={rep.apellido2}
                          onChange={(e) =>
                            updateRepresentante(index, "apellido2", e.target.value)
                          }
                          placeholder="Ej. García"
                          className={inputClass}
                          maxLength={100}
                          required
                        />
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
                          className={inputClass}
                          maxLength={100}
                          required
                        />
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
                              .slice(0, 15);
                            updateRepresentante(index, "telefono", onlyDigits);
                          }}
                          placeholder="Ej. 8888-8888"
                          className={inputClass}
                          maxLength={15}
                        />
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
                          className={inputClass}
                          maxLength={100}
                        />
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
                          className={inputClass}
                          maxLength={255}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

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
              className="px-4 py-2 rounded-lg bg-[#8C3A33] hover:bg-[#7a312b] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}