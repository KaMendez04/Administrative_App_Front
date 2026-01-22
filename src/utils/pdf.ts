export function openSolicitudPDF(id: number) {
  window.open(`${import.meta.env.VITE_API_URL}/solicitudes/${id}/pdf`, "_blank");
}

// utils/downloadBlob.ts
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename; // ✅ fuerza descarga
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
