import { useCallback } from "react";

/**
 * Formatea a colones (₡) con separadores de miles.
 * Ej: "1000" -> "1.000"
 */
export function formatCR(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 15); // solo dígitos, máx 15
  return digits
    ? Number(digits).toLocaleString("es-CR", { maximumFractionDigits: 0 })
    : "";
}

/**
 * Parsea un string formateado a número.
 * Ej: "1.000" -> 1000
 */
export function parseCR(formatted: string): number {
  const digits = formatted.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}


export function useMoneyInput(p0: string) {
  const handleInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const target = e.currentTarget;
      target.value = formatCR(target.value);
    },
    []
  );

  return { handleInput, formatCR, parseCR };
}
