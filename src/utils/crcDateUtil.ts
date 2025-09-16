// util: convierte decimal-string a número y formatea ₡

export function toNum(x: string | number | null | undefined) {
  if (x === null || x === undefined) return 0;
  if (typeof x === "number") return x;
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

export const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC" }).format(n);