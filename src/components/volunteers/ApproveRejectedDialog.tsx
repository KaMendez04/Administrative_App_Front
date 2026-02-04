import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { ActionButtons } from "../ActionButtons";

type Props = {
  open: boolean;
  initialMotivo?: string;
  onClose: () => void;
  onConfirm: (motivo: string) => Promise<void> | void;
};

export function ApproveRejectedDialog({
  open,
  initialMotivo = "",
  onClose,
  onConfirm,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: { motivo: initialMotivo || "" },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        await onConfirm((value as any).motivo ?? "");
        form.reset();
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // cuando cambie initialMotivo (abrís con otra solicitud), actualizá el valor
  useEffect(() => {
    if (!open) return;
    form.setFieldValue("motivo", initialMotivo || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialMotivo]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF9F5] border border-[#E6E1D6] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[#E6E1D6] bg-white/60">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#E6EDC8] flex items-center justify-center">
              <span className="text-[#5A7018] font-bold">✓</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#374321]">
                Aprobar solicitud rechazada
              </h3>
              <p className="text-sm text-[#556B2F] mt-0.5">
                Podés actualizar la nota/observación antes de aprobar.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="px-6 py-6 space-y-5"
        >
          <div className="rounded-xl bg-[#F8F9F3] border border-[#EAEFE0] p-4">
            <p className="text-sm text-[#374321] font-medium">
              Esta nota quedará guardada en la solicitud.
            </p>
          </div>

          <form.Field name="motivo">
            {(f: any) => (
              <div>
                <label className="block text-[11px] font-semibold text-[#5B732E] uppercase tracking-wide mb-1.5">
                  Nota / Observación (opcional)
                </label>
                <textarea
                  value={f.state.value}
                  onChange={(e) => f.handleChange(e.target.value)}
                  onBlur={f.handleBlur}
                  rows={5}
                  placeholder="Ej: Documentos corregidos y validados. Aprobado."
                  className="
                    w-full rounded-lg border bg-white/90 px-4 py-3 text-sm
                    outline-none transition resize-none
                    placeholder:text-gray-400
                    focus:bg-white
                    border-[#E6E1D6] focus:border-[#5B732E]
                  "
                  maxLength={255}
                  disabled={isSubmitting}
                />
                <div className="flex justify-end items-center mt-1.5">
                  <p className="text-xs text-gray-500">
                    {String(f.state.value ?? "").length}/255 caracteres
                  </p>
                </div>
              </div>
            )}
          </form.Field>

          <div className="flex justify-end pt-4 border-t border-[#E6E1D6]">
            <ActionButtons
              onCancel={onClose}
              onSave={() => {}}
              showCancel
              showSave
              showText
              saveButtonType="submit"
              isSaving={isSubmitting}
              saveText="Aprobar"
              cancelText="Cancelar"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
