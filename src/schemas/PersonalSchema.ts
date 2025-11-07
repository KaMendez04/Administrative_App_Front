import { z } from "zod";

const todayYMD = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};


export const personalSchema = z.object({
  IDE: z.string().optional(),
  name: z.string().min(1, "Requerido"),
  lastname1: z.string().min(1, "Requerido"),
  lastname2: z.string().min(1, "Requerido"),
  birthDate: z.string().min(1, "Requerido"),
  email: z.union([z.string().email("Correo inválido"), z.literal("")]).optional(),
  phone: z.string().regex(/^\d{8}$/, "Debe tener 8 dígitos"),
  direction: z.string().min(1, "Requerido"),
  occupation: z.string().min(1, "Requerido"),
  isActive: z.boolean().optional(),
   startWorkDate: z.string().optional(),          // YYYY-MM-DD o vacío
    endWorkDate: z.union([z.string(), z.null()]).optional(), // YYYY-MM-DD | null | vacío
  })
  .superRefine((data, ctx) => {
    const today = todayYMD();

    // Regla 1: startWorkDate debe ser < hoy (si viene)
    if (data.startWorkDate && data.startWorkDate >= today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startWorkDate"],
        message: "La fecha de inicio debe ser anterior a hoy",
      });
    }

    // Regla 2: endWorkDate >= startWorkDate (si ambas vienen)
    if (data.endWorkDate && data.startWorkDate) {
      const end = data.endWorkDate as string;
      if (end < data.startWorkDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endWorkDate"],
          message: "La fecha de salida no puede ser anterior a la fecha de inicio",
        });
      }
    }
});

export type PersonalFormValues = z.infer<typeof personalSchema>;
