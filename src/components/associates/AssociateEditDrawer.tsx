import { useForm } from "@tanstack/react-form";
import { UpdateAssociateSchema, type UpdateAssociateValues } from "../../schemas/adminSolicitudes";
import { useToggleAssociateStatus } from "../../hooks/associates/useToggleAssociateStatus";
import { ActionButtons } from "../../components/ActionButtons";
import Swal from "sweetalert2";
import { useState } from "react";

function validateWithZod(v: any) {
  const r = UpdateAssociateSchema.safeParse(v);
  if (r.success) return;
  const errors: Record<string, string> = {};
  for (const i of r.error.issues) {
    const k = String(i.path[0] ?? "");
    if (!errors[k]) errors[k] = i.message;
  }
  return errors;
}

type Props = {
  open: boolean;
  onClose: () => void;
  initial: UpdateAssociateValues & { 
    nombreCompleto?: string;
    idAsociado?: number;
    estado?: boolean;
  };
  onSave: (patch: UpdateAssociateValues) => Promise<void> | void;
};

// type FieldName = "telefono" | "email" | "direccion" | "marcaGanado" | "CVO";

// const fields: Array<{ name: FieldName; label: string; placeholder?: string; maxLength?: number }> = [
//   { name: "telefono",    label: "Teléfono",         placeholder: "Ej. 8888-8888", maxLength: 20 },
//   { name: "email",       label: "Email",            placeholder: "correo@ejemplo.com", maxLength: 100 },
//   { name: "direccion",   label: "Dirección",        placeholder: "Distrito, cantón, provincia…", maxLength: 200 },
//   { name: "marcaGanado", label: "Marca de Ganado",  placeholder: "Código o identificador", maxLength: 50 },
//   { name: "CVO",         label: "CVO",              placeholder: "CVO", maxLength: 50 },
// ];

export function AssociateEditDrawer({ open, onClose, initial, onSave }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toggleStatus = useToggleAssociateStatus();

  const form = useForm({
    defaultValues: {
      telefono:    initial.telefono    ?? "",
      email:       initial.email       ?? "",
      direccion:   initial.direccion   ?? "",
      marcaGanado: initial.marcaGanado ?? "",
      CVO:         initial.CVO         ?? "",
    },
    validators: {
      onChange: ({ value }) => validateWithZod(value),
      onSubmit: ({ value }) => validateWithZod(value),
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const payload = Object.fromEntries(
          Object.entries(value).filter(([_, v]) => String(v ?? "").trim() !== "")
        ) as UpdateAssociateValues;
        await onSave(payload);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleToggleClick = async () => {
    const currentStatus = initial.estado ?? false;
    
    const result = await Swal.fire({
      title: currentStatus ? '¿Desactivar asociado?' : '¿Activar asociado?',
      html: currentStatus 
        ? `Estás a punto de <span style="color: #dc2626; font-weight: 600;">desactivar</span> a <span style="color: #33361D; font-weight: 600;">${initial.nombreCompleto}</span>. El asociado no podrá acceder a la plataforma hasta que sea reactivado.`
        : `Estás a punto de <span style="color: #16a34a; font-weight: 600;">activar</span> a <span style="color: #33361D; font-weight: 600;">${initial.nombreCompleto}</span>. El asociado podrá acceder a la plataforma.`,
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

    if (result.isConfirmed && initial.idAsociado) {
      await toggleStatus.mutateAsync(initial.idAsociado);
      onClose();
    }
  };

  if (!open) return null;

  const currentStatus = initial.estado ?? false;

  const inputClass =
    "w-full rounded-lg border border-[#E6E1D6] bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-[#5B732E] focus:bg-white";
  const label =
    "block text-[11px] font-semibold text-[#556B2F] uppercase tracking-wide mb-1";
  const errorClass = "border-red-500 focus:border-red-500";
  const errorText = "text-xs text-red-600 mt-1";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#FAF9F5] border border-[#E6E1D6] rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E1D6] bg-white/60">
          <h2 className="text-xl font-bold text-[#374321]">
            Editar Información del Asociado
          </h2>
          {initial.nombreCompleto && (
            <p className="text-sm text-[#556B2F] mt-1">
              {initial.nombreCompleto}
            </p>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => { 
            e.preventDefault(); 
            form.handleSubmit(); 
          }}
          className="px-6 py-6 space-y-6 overflow-y-auto flex-1"
        >
          {/* TOGGLE DE ESTADO */}
          <div className="rounded-xl bg-[#F8F9F3] p-4 border-2 border-[#EAEFE0]">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-[#33361D] mb-1">
                  Estado del Asociado
                </label>
                <p className="text-xs text-gray-600">
                  {currentStatus ? "El asociado está activo y puede acceder" : "El asociado está inactivo"}
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
                aria-label={currentStatus ? "Desactivar asociado" : "Activar asociado"}
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

          {/* Información de Contacto */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#556B2F]">
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Teléfono */}
              <form.Field name="telefono">
                {(f: any) => (
                  <div>
                    <label className={label} htmlFor="telefono">
                      Teléfono
                    </label>
                    <input
                      id="telefono"
                      type="text"
                      value={f.state.value}
                      onChange={(e) => {
                        const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 20);
                        f.handleChange(onlyDigits);
                      }}
                      onBlur={f.handleBlur}
                      placeholder="Ej. 8888-8888"
                      className={`${inputClass} ${f.state.meta.errors?.length ? errorClass : ""}`}
                      maxLength={20}
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {f.state.meta.errors?.length > 0 && (
                        <p className={errorText}>{f.state.meta.errors[0]}</p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {f.state.value.length}/20 caracteres
                      </p>
                    </div>
                  </div>
                )}
              </form.Field>

              {/* Email */}
              <form.Field name="email">
                {(f: any) => (
                  <div>
                    <label className={label} htmlFor="email">
                      Correo
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      onBlur={f.handleBlur}
                      placeholder="correo@ejemplo.com"
                      className={`${inputClass} ${f.state.meta.errors?.length ? errorClass : ""}`}
                      maxLength={100}
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {f.state.meta.errors?.length > 0 && (
                        <p className={errorText}>{f.state.meta.errors[0]}</p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {f.state.value.length}/100 caracteres
                      </p>
                    </div>
                  </div>
                )}
              </form.Field>

              {/* Dirección */}
              <form.Field name="direccion">
                {(f: any) => (
                  <div className="md:col-span-2">
                    <label className={label} htmlFor="direccion">
                      Dirección
                    </label>
                    <input
                      id="direccion"
                      type="text"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      onBlur={f.handleBlur}
                      placeholder="Distrito, cantón, provincia…"
                      className={`${inputClass} ${f.state.meta.errors?.length ? errorClass : ""}`}
                      maxLength={200}
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {f.state.meta.errors?.length > 0 && (
                        <p className={errorText}>{f.state.meta.errors[0]}</p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {f.state.value.length}/200 caracteres
                      </p>
                    </div>
                  </div>
                )}
              </form.Field>
            </div>
          </section>

          {/* Información Ganadera */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#556B2F]">
              Información Ganadera
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Marca de Ganado */}
              <form.Field name="marcaGanado">
                {(f: any) => (
                  <div>
                    <label className={label} htmlFor="marcaGanado">
                      Marca de Ganado
                    </label>
                    <input
                      id="marcaGanado"
                      type="text"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      onBlur={f.handleBlur}
                      placeholder="Código o identificador"
                      className={`${inputClass} ${f.state.meta.errors?.length ? errorClass : ""}`}
                      maxLength={50}
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {f.state.meta.errors?.length > 0 && (
                        <p className={errorText}>{f.state.meta.errors[0]}</p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {f.state.value.length}/50 caracteres
                      </p>
                    </div>
                  </div>
                )}
              </form.Field>

              {/* CVO */}
              <form.Field name="CVO">
                {(f: any) => (
                  <div>
                    <label className={label} htmlFor="CVO">
                      CVO
                    </label>
                    <input
                      id="CVO"
                      type="text"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      onBlur={f.handleBlur}
                      placeholder="CVO"
                      className={`${inputClass} ${f.state.meta.errors?.length ? errorClass : ""}`}
                      maxLength={50}
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {f.state.meta.errors?.length > 0 && (
                        <p className={errorText}>{f.state.meta.errors[0]}</p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {f.state.value.length}/50 caracteres
                      </p>
                    </div>
                  </div>
                )}
              </form.Field>
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