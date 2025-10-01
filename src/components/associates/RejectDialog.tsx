import { useForm } from "@tanstack/react-form";
import { RejectSchema, type RejectValues } from "../../schemas/adminAssociates";

function validateWithZod(v: any) {
  const r = RejectSchema.safeParse(v);
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
  onConfirm: (motivo: string) => Promise<void> | void;
};

export function RejectDialog({ open, onClose, onConfirm }: Props) {
  const form = useForm({
    defaultValues: { motivo: "" },
    validators: { 
      onChange: ({ value }) => validateWithZod(value), 
      onSubmit: ({ value }) => validateWithZod(value) 
    },
    onSubmit: async ({ value }) => {
      await onConfirm((value as RejectValues).motivo);
      form.reset();
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-[#33361D] mb-2">Rechazar solicitud</h3>
        <p className="text-sm text-gray-600 mb-4">Por favor, explica el motivo del rechazo</p>
        
        <form
          onSubmit={(e) => { 
            e.preventDefault(); 
            form.handleSubmit(); 
          }}
          className="space-y-4"
        >
          <form.Field name="motivo">
            {(f: any) => (
              <div>
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Motivo del rechazo
                </label>
                <textarea
                  value={f.state.value}
                  onChange={(e) => f.handleChange(e.target.value)}
                  onBlur={f.handleBlur}
                  rows={4}
                  placeholder="Explica el motivo del rechazo (mínimo 5 caracteres)..."
                  className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition resize-none"
                />
                {f.state.meta.errors && f.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600 mt-1.5 font-medium">
                    {f.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              className="px-5 py-2.5 rounded-xl border-2 border-[#EAEFE0] text-[#33361D] font-semibold hover:bg-[#EAEFE0] transition"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow-sm"
            >
              Rechazar solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}