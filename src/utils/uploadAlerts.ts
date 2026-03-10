import Swal from "sweetalert2";

function normalizeUploadError(message?: string) {
  const raw = (message || "").toLowerCase();

  if (
    raw.includes("network error") ||
    raw.includes("failed to fetch") ||
    raw.includes("timeout") ||
    raw.includes("connection") ||
    raw.includes("conex")
  ) {
    return {
      title: "No se pudo subir el archivo",
      text: "Parece que se perdió la conexión o el servidor no respondió a tiempo. Revisá tu internet e intentá nuevamente.",
    };
  }

  if (
    raw.includes("too large") ||
    raw.includes("file too large") ||
    raw.includes("max file size") ||
    raw.includes("10 mb") ||
    raw.includes("size")
  ) {
    return {
      title: "Archivo demasiado pesado",
      text: "El archivo supera el tamaño máximo permitido de 10 MB. Subí una imagen o video más liviano.",
    };
  }

  if (
    raw.includes("invalid file") ||
    raw.includes("invalid type") ||
    raw.includes("unsupported") ||
    raw.includes("format") ||
    raw.includes("mime")
  ) {
    return {
      title: "Formato no permitido",
      text: "El archivo seleccionado no tiene un formato válido. Probá con JPG, PNG, WEBP, GIF o AVIF.",
    };
  }

  if (
    raw.includes("413") ||
    raw.includes("payload too large")
  ) {
    return {
      title: "Archivo demasiado pesado",
      text: "El archivo excede el límite permitido por el servidor.",
    };
  }

  if (
    raw.includes("500") ||
    raw.includes("internal server error") ||
    raw.includes("cloudinary upload failed")
  ) {
    return {
      title: "Error del servidor",
      text: "No fue posible completar la subida en este momento. Intentá nuevamente en unos segundos.",
    };
  }

  return {
    title: "No se pudo subir el archivo",
    text: "Ocurrió un problema al subir el archivo. Verificá el formato, el tamaño y tu conexión a internet.",
  };
}

export async function showUploadErrorModal(fileName?: string, errorMessage?: string) {
  const parsed = normalizeUploadError(errorMessage);

  return Swal.fire({
    icon: "error",
    title: parsed.title,
    html: `
      <div style="font-size:14px; line-height:1.5; color:#4B5563;">
        <p style="margin:0 0 10px 0;">${parsed.text}</p>
        ${
          fileName
            ? `<p style="margin:0; font-weight:600; color:#243127;">Archivo: ${fileName}</p>`
            : ""
        }
      </div>
    `,
    confirmButtonText: "Entendido",
    confirmButtonColor: "#5B732E",
    background: "#FAF9F5",
    scrollbarPadding: false,
    heightAuto: false,
    returnFocus: false,
    customClass: {
      popup: "rounded-2xl",
      confirmButton: "rounded-xl px-6 py-3 font-semibold",
    },
  });
}