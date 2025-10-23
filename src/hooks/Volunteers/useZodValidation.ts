// hooks/Volunteers/useZodValidation.ts
import { useState } from "react";
import { z } from "zod";

export function useZodValidation<T extends z.ZodObject<any>>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (fieldName: string, value: any) => {
    try {
      // ✅ Crear un objeto temporal solo con ese campo para validar
      const testData = { [fieldName]: value };
      const result = schema.safeParse(testData);
      
      if (result.success) {
        // Si pasa la validación, eliminar el error de ese campo
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      } else {
        // Si falla, buscar el error específico de ese campo
        const fieldError = result.error.issues.find(
          (issue) => issue.path[0] === fieldName
        );
        
        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: fieldError.message,
          }));
        } else {
          // Si no hay error del campo específico, limpiarlo
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        }
      }
    } catch (err: any) {
      console.error("Error en validateField:", err);
    }
  };

  const validateAll = (data: any): boolean => {
    try {
      const result = schema.safeParse(data);
      
      if (result.success) {
        setErrors({});
        return true;
      } else {
        const newErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
        return false;
      }
    } catch (err: any) {
      console.error("Error en validateAll:", err);
      return false;
    }
  };

  const clearErrors = () => setErrors({});

  return { errors, validateField, validateAll, clearErrors };
}