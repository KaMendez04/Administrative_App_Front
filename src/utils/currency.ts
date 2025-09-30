export const crc = (n: number) =>
    new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0,
    }).format(Number.isFinite(n) ? n : 0);
  