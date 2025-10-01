import { useForm } from "@tanstack/react-form";
import { UpdateAssociateSchema, type UpdateAssociateValues } from "../../schemas/adminAssociates";

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
  initial: UpdateAssociateValues & { nombreCompleto?: string };
  onSave: (patch: UpdateAssociateValues) => Promise<void> | void;
};

type FieldName = "telefono" | "email" | "direccion" | "marcaGanado" | "CVO";

const fields: Array<{ name: FieldName; label: string; placeholder?: string }> = [
  { name: "telefono",    label: "Teléfono",         placeholder: "8888-8888" },
  { name: "email",       label: "Email",            placeholder: "correo@ejemplo.com" },
  { name: "direccion",   label: "Dirección",        placeholder: "Dirección exacta" },
  { name: "marcaGanado", label: "Marca de Ganado",  placeholder: "Código o identificador" },
  { name: "CVO",         label: "CVO",              placeholder: "CVO" },
];

export function AssociateEditDrawer({ open, onClose, initial, onSave }: Props) {
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
      const payload = Object.fromEntries(
        Object.entries(value).filter(([_, v]) => String(v ?? "").trim() !== "")
      ) as UpdateAssociateValues;
      await onSave(payload);
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative">
          <div className="h-24 bg-gradient-to-r from-[#EAEFE0] via-[#F8F9F3] to-[#FEF6E0]" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-4">
            <h3 className="text-xl font-bold text-[#33361D]">Editar asociado</h3>
            {initial.nombreCompleto && (
              <p className="text-sm text-[#5B732E] mt-0.5 font-medium">{initial.nombreCompleto}</p>
            )}
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 hover:bg-white/90 border border-[#EAEFE0] text-[#33361D] shadow-sm"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
          className="flex-1 overflow-y-auto px-6 pt-6 pb-32"
        >
          <div className="grid grid-cols-1 gap-5">
            {fields.map(({ name, label, placeholder }) => (
              <form.Field key={name} name={name}>
                {(f: any) => (
                  <div>
                    <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                      {label}
                    </label>
                    <input
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      onBlur={f.handleBlur}
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-[#D8E0C7] bg-white px-3 py-3 text-[#33361D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] transition"
                    />
                    {!!f.state.meta.errors?.length && (
                      <p className="text-sm text-red-600 mt-1.5 font-medium">
                        {f.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            ))}
          </div>

          {/* Sticky bottom actions */}
          <div className="pointer-events-none fixed inset-x-0 bottom-0">
            <div className="mx-auto max-w-[520px] sm:ml-auto sm:mr-0">
              <div className="pointer-events-auto bg-white/90 backdrop-blur border-t border-[#EAEFE0] px-6 py-4">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl border border-[#D8E0C7] text-[#33361D] font-semibold hover:bg-[#F7FAF1] transition"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#5B732E] text-white font-semibold hover:bg-[#556B2F] shadow-sm transition"
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
