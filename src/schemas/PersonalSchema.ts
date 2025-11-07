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
  startWorkDate: z.string().optional(),
  endWorkDate: z.union([z.string(), z.null()]).optional(),
})
.superRefine((data, ctx) => {
  const today = todayYMD();
  const currentYear = new Date().getFullYear();

  // Regla 1: birthDate no puede ser de este año
  if (data.birthDate) {
    const birthYear = parseInt(data.birthDate.split('-')[0]);
    if (birthYear >= currentYear) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["birthDate"],
        message: `No se permiten fechas del año ${currentYear} o posteriores`,
      });
    }
  }

  // Regla 2: startWorkDate debe ser < hoy (anterior a hoy)
  if (data.startWorkDate && data.startWorkDate >= today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["startWorkDate"],
      message: "La fecha de inicio debe ser anterior a hoy",
    });
  }

  // Regla 3: endWorkDate debe ser > startWorkDate (al menos 1 día después)
  if (data.endWorkDate && data.startWorkDate) {
    const end = data.endWorkDate as string;
    const start = data.startWorkDate;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Verificar que end sea DESPUÉS de start (no el mismo día)
    if (endDate <= startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endWorkDate"],
        message: "La fecha de salida debe ser al menos 1 día después de la fecha de inicio",
      });
    }
  }
});

export type PersonalFormValues = z.infer<typeof personalSchema>;