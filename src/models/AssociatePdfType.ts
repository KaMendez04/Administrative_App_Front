export type PdfListParams = {
  estado?: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  search?: string;
  sort?: string; // ej: "createdAt:DESC"
};