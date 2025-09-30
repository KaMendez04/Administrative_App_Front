// import { useForm } from "@tanstack/react-form";
// import { RejectSchema, RejectValues } from "../../schemas/adminAssociates";

// function validateWithZod(v: any) {
//   const r = RejectSchema.safeParse(v);
//   if (r.success) return;
//   const errors: Record<string, string> = {};
//   for (const i of r.error.issues) {
//     const k = String(i.path[0] ?? "");
//     if (!errors[k]) errors[k] = i.message;
//   }
//   return errors;
// }

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onConfirm: (motivo: string) => Promise<void> | void;
// };

// export function RejectDialog({ open, onClose, onConfirm }: Props) {
//   const form = useForm({
//     defaultValues: { motivo: "" },
//     validators: { onChange: ({ value }) => validateWithZod(value), onSubmit: ({ value }) => validateWithZod(value) },
//     onSubmit: async ({ value }) => {
//       await onConfirm((value as RejectValues).motivo);
//       onClose();
//     },
//   });

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded shadow p-4 w-full max-w-md">
//         <h3 className="text-lg font-semibold mb-3">Rechazar solicitud</h3>
//         <form
//           onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
//           className="space-y-3"
//         >
//           <form.Field name="motivo">
//             {(f: any) => (
//               <div>
//                 <label className="block text-sm mb-1">Motivo</label>
//                 <textarea
//                   value={f.state.value}
//                   onChange={(e) => f.handleChange(e.target.value)}
//                   onBlur={f.handleBlur}
//                   rows={4}
//                   className="w-full border rounded px-3 py-2"
//                 />
//                 {form.state?.errors.motivo && <p className="text-sm text-red-600 mt-1">{form.state.errors.motivo}</p>}
//               </div>
//             )}
//           </form.Field>

//           <div className="flex justify-end gap-2">
//             <button type="button" className="px-3 py-2 border rounded" onClick={onClose}>Cancelar</button>
//             <button type="submit" className="px-3 py-2 rounded bg-red-600 text-white">Rechazar</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
