// src/utils/cloudinaryCrop.ts
export const CROP_W = 1200;
export const CROP_H = 630;

export function isCloudinaryUrl(url: string) {
  return typeof url === "string" && url.includes("/upload/");
}

// ✅ Extraer URL base sin transformaciones
export function getBaseCloudinaryUrl(url: string): string {
  if (!url || !isCloudinaryUrl(url)) return url;

  const marker = "/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;

  const base = url.slice(0, i + marker.length);
  const rest = url.slice(i + marker.length);

  // Remover transformaciones si existen (todo entre /upload/ y el nombre del archivo)
  const parts = rest.split("/");
  const fileName = parts[parts.length - 1];
  const maybeVersion = parts[parts.length - 2];

  // Si hay versión (v seguido de números)
  if (maybeVersion && maybeVersion.startsWith("v") && /^\d+$/.test(maybeVersion.slice(1))) {
    return `${base}${maybeVersion}/${fileName}`;
  }

  return `${base}${fileName}`;
}

export function cloudinaryBuildTransformed(url: string, transform: string) {
  if (!url) return url;
  const baseUrl = getBaseCloudinaryUrl(url);
  const marker = "/upload/";
  const i = baseUrl.indexOf(marker);
  if (i === -1) return baseUrl;

  const base = baseUrl.slice(0, i + marker.length);
  const rest = baseUrl.slice(i + marker.length);
  return `${base}${transform}/${rest}`;
}

export function cloudinaryOffsetFromPercent(percent: number, dimension: number) {
  const clamped = Math.max(0, Math.min(100, percent));
  return Math.round(((clamped - 50) / 100) * dimension);
}

// ✅ URL final para mostrar en informativa / cards / etc.
export function buildEventIllustration(
  illustrationUrl: string,
  cropX?: number | null,
  cropY?: number | null
) {
  if (!illustrationUrl) return "";
  if (!isCloudinaryUrl(illustrationUrl)) return illustrationUrl;

  const x = cloudinaryOffsetFromPercent(cropX ?? 50, CROP_W);
  const y = cloudinaryOffsetFromPercent(cropY ?? 50, CROP_H);

  const t = `f_auto,q_auto,w_${CROP_W},h_${CROP_H},c_fill,g_xy_center,x_${x},y_${y}`;
  return cloudinaryBuildTransformed(illustrationUrl, t);
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    // OJO: para URLs externas puede fallar si no permiten CORS.
    // Para archivos locales (objectURL) funciona perfecto.
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Recorta y escala en modo "cover" a un canvas outW x outH,
 * centrado según cropPercent (0-100). 50/50 es centro.
 */
export async function cropToBlob(
  src: string,
  cropPercent: { x: number; y: number },
  outW: number,
  outH: number
): Promise<Blob> {
  const img = await loadImage(src)

  const iw = img.naturalWidth
  const ih = img.naturalHeight
  if (!iw || !ih) throw new Error("Imagen inválida para recorte")

  // cover scale
  const scale = Math.max(outW / iw, outH / ih)
  const sw = outW / scale
  const sh = outH / scale

  const clamp01 = (n: number) => Math.max(0, Math.min(100, n))

  // centro en px en imagen original según %
  const cx = (clamp01(cropPercent.x) / 100) * iw
  const cy = (clamp01(cropPercent.y) / 100) * ih

  // rectángulo fuente
  let sx = cx - sw / 2
  let sy = cy - sh / 2

  // clamp al borde
  sx = Math.max(0, Math.min(iw - sw, sx))
  sy = Math.max(0, Math.min(ih - sh, sy))

  const canvas = document.createElement("canvas")
  canvas.width = outW
  canvas.height = outH

  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("No canvas context")

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("No se pudo generar el blob"))
        resolve(blob)
      },
      "image/jpeg",
      0.92
    )
  })
}

export function blobToFile(blob: Blob, filename: string) {
  return new File([blob], filename, { type: blob.type || "image/jpeg" })
}
