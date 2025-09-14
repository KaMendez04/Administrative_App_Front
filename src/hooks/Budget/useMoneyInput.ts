import { useCallback, useState } from "react";


export function formatCR(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 15); // solo dígitos, máx 15
  return digits
    ? Number(digits).toLocaleString("es-CR", { maximumFractionDigits: 0 })
    : "";
}

export function parseCR(formatted: string): number {
  const digits = formatted.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

export function useMoneyInput(p0: string) {
  const [value, setValue] = useState(p0);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const target = e.currentTarget;
      const formatted = formatCR(target.value);
      setValue(formatted);
    },
    []
  );

  return { value, setValue, handleInput, formatCR, parseCR };
}
