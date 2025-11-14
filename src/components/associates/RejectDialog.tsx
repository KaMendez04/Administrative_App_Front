import { useForm } from "@tanstack/react-form";
import { RejectSchema, type RejectValues } from "../../schemas/adminSolicitudes";
import { ActionButtons } from "../ActionButtons";
import { useState } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: { motivo: "" },
    validators: { 
      onChange: ({ value }) => validateWithZod(value), 
      onSubmit: ({ value }) => validateWithZod(value) 
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        await onConfirm((value as RejectValues).motivo);
        form.reset();
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!open) return null;

  const hasErrors = form.state.fieldMeta.motivo?.errors?.length > 0;

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF9F5] border border-[#E6E1D6] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E1D6] bg-white/60">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#374321]">
                Rechazar Solicitud
              </h3>
              <p className="text-sm text-[#8C3A33] mt-0.5">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form
          onSubmit={(e) => { 
            e.preventDefault(); 
            form.handleSubmit(); 
          }}
          className="px-6 py-6 space-y-5"
        >
          <div className="rounded-xl bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800 font-medium">
              Al rechazar esta solicitud, el solicitante será notificado del motivo. 
              Por favor, proporciona una explicación clara y constructiva.
            </p>
          </div>

          <form.Field name="motivo">
            {(f: any) => (
              <div>
                <label className="block text-[11px] font-semibold text-[#8C3A33] uppercase tracking-wide mb-1.5">
                  Motivo del rechazo *
                </label>
                <textarea
                  value={f.state.value}
                  onChange={(e) => f.handleChange(e.target.value)}
                  onBlur={f.handleBlur}
                  rows={5}
                  placeholder="Explica de manera clara el motivo del rechazo (mínimo 5 caracteres)..."
                  className={`
                    w-full rounded-lg border bg-white/90 px-4 py-3 text-sm 
                    outline-none transition resize-none
                    placeholder:text-gray-400
                    focus:bg-white
                    ${f.state.meta.errors?.length 
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-[#E6E1D6] focus:border-[#8C3A33]'
                    }
                  `}
                  maxLength={500}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1.5">
                  {f.state.meta.errors && f.state.meta.errors.length > 0 ? (
                    <p className="text-xs text-red-600 font-medium">
                      {f.state.meta.errors[0]}
                    </p>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Mínimo 5 caracteres
                    </span>
                  )}
                  <p className="text-xs text-gray-500">
                    {f.state.value.length}/500 caracteres
                  </p>
                </div>
              </div>
            )}
          </form.Field>

          {/* Footer con ActionButtons */}
          <div className="flex justify-end pt-4 border-t border-[#E6E1D6]">
            <ActionButtons
              onCancel={onClose}
              onSave={() => {}}
              showCancel={true}
              showSave={true}
              showText={true}
              saveButtonType="submit"
              isSaving={isSubmitting}
              disabled={hasErrors}
              saveText="Rechazar solicitud"
              cancelText="Cancelar"
            />
          </div>
        </form>
      </div>
    </div>
  );
}