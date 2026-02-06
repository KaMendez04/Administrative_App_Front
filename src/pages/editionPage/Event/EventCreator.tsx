import React, { useEffect, useMemo, useRef, useState } from "react"
import { showSuccessAlert } from "../../../utils/alerts"
import { ActionButtons } from "../../../components/ActionButtons"
import type { EventInput } from "../../../models/editionSection/EventEditionType"
import { useCloudinaryUpload } from "../../../hooks/Cloudinary/useCloudinaryUpload"
import { Loader2, Upload } from "lucide-react"

const CROP_W = 1200
const CROP_H = 630

function isCloudinaryUrl(url: string) {
  return typeof url === "string" && url.includes("/upload/")
}

// ✅ Extraer URL base sin transformaciones (para preview si ya viene de Cloudinary)
function getBaseCloudinaryUrl(url: string): string {
  if (!url || !isCloudinaryUrl(url)) return url

  const marker = "/upload/"
  const i = url.indexOf(marker)
  if (i === -1) return url

  const base = url.slice(0, i + marker.length)
  const rest = url.slice(i + marker.length)

  const parts = rest.split("/")
  const fileName = parts[parts.length - 1]
  const version = parts[parts.length - 2]

  if (version && version.startsWith("v") && /^\d+$/.test(version.slice(1))) {
    return `${base}${version}/${fileName}`
  }
  return `${base}${fileName}`
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Recorta y escala para llenar (cover) un canvas 1200x630, centrado según cropPercent (0-100)
 * - cropPercent.x/y: 50/50 = centro
 */
async function cropToBlob(
  src: string,
  cropPercent: { x: number; y: number },
  outW = CROP_W,
  outH = CROP_H
): Promise<Blob> {
  const img = await loadImage(src)

  const iw = img.naturalWidth
  const ih = img.naturalHeight

  // cover scale
  const scale = Math.max(outW / iw, outH / ih)
  const sw = outW / scale
  const sh = outH / scale

  // centro en px dentro de la imagen original según %
  const cx = (Math.max(0, Math.min(100, cropPercent.x)) / 100) * iw
  const cy = (Math.max(0, Math.min(100, cropPercent.y)) / 100) * ih

  // source rect top-left
  let sx = cx - sw / 2
  let sy = cy - sh / 2

  // clamp
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
        if (!blob) return reject(new Error("No se pudo generar el recorte"))
        resolve(blob)
      },
      "image/jpeg",
      0.92
    )
  })
}

function blobToFile(blob: Blob, filename: string) {
  return new File([blob], filename, { type: blob.type || "image/jpeg" })
}

export default function EventCreator({
  onSubmit,
}: {
  onSubmit: (data: EventInput) => void
}) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")

  // input text puede ser URL pegada
  const [illustration, setIllustration] = useState("")

  // ✅ NUEVO: si el usuario escogió archivo, lo guardamos aquí (SIN subir)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string>("") // objectURL

  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const upload = useCloudinaryUpload()
  const fileRef = useRef<HTMLInputElement>(null)

  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const dragState = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
    pointerId: -1,
  })

  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }
  const minDate = getTodayDate()

  useEffect(() => {
    const changed =
      title.trim() !== "" ||
      date.trim() !== "" ||
      description.trim() !== "" ||
      illustration.trim() !== "" ||
      !!pendingFile
    setHasChanges(changed)
  }, [title, date, description, illustration, pendingFile])

  // reset offset cuando cambia la imagen
  useEffect(() => {
    setOffset({ x: 0, y: 0 })
  }, [illustration, localPreview])

  // liberar objectURL
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  // ✅ fuente real para preview:
  // - si hay archivo local => localPreview
  // - si no => illustration (pero si es cloudinary, usamos base para permitir “cover” limpio)
  const previewSrc = useMemo(() => {
    if (pendingFile && localPreview) return localPreview
    if (!illustration) return ""
    return isCloudinaryUrl(illustration) ? getBaseCloudinaryUrl(illustration) : illustration
  }, [pendingFile, localPreview, illustration])

  const positionAsPercent = useMemo(() => {
    if (!dragRef.current || !imageRef.current) return { x: 50, y: 50 }

    const container = dragRef.current.getBoundingClientRect()
    const img = imageRef.current

    const imgWidth = img.naturalWidth
    const imgHeight = img.naturalHeight
    if (!imgWidth || !imgHeight) return { x: 50, y: 50 }

    const containerRatio = container.width / container.height
    const imageRatio = imgWidth / imgHeight

    let renderedWidth: number, renderedHeight: number
    if (imageRatio > containerRatio) {
      renderedHeight = container.height
      renderedWidth = renderedHeight * imageRatio
    } else {
      renderedWidth = container.width
      renderedHeight = renderedWidth / imageRatio
    }

    const maxOffsetX = Math.max(0, (renderedWidth - container.width) / 2)
    const maxOffsetY = Math.max(0, (renderedHeight - container.height) / 2)

    const percentX = maxOffsetX > 0 ? 50 + (offset.x / maxOffsetX) * 50 : 50
    const percentY = maxOffsetY > 0 ? 50 - (offset.y / maxOffsetY) * 50 : 50

    return {
      x: Math.max(0, Math.min(100, percentX)),
      y: Math.max(0, Math.min(100, percentY)),
    }
  }, [offset])

  const handlePick = () => fileRef.current?.click()

  // ✅ YA NO SUBE. Solo setea pendingFile + preview
  const onPickFile = (file: File | null) => {
    if (!file) return

    // limpiar preview anterior
    if (localPreview) URL.revokeObjectURL(localPreview)

    const obj = URL.createObjectURL(file)
    setPendingFile(file)
    setLocalPreview(obj)

    // limpiamos el input text (opcional)
    setIllustration("")
    setOffset({ x: 0, y: 0 })

    if (fileRef.current) fileRef.current.value = ""
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    if (!previewSrc) return

    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
      pointerId: e.pointerId,
    }

    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return
    if (e.pointerId !== dragState.current.pointerId) return

    e.preventDefault()

    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY

    if (!dragRef.current || !imageRef.current) return

    const container = dragRef.current.getBoundingClientRect()
    const img = imageRef.current
    const imgWidth = img.naturalWidth
    const imgHeight = img.naturalHeight
    if (!imgWidth || !imgHeight) return

    const containerRatio = container.width / container.height
    const imageRatio = imgWidth / imgHeight

    let renderedWidth: number, renderedHeight: number
    if (imageRatio > containerRatio) {
      renderedHeight = container.height
      renderedWidth = renderedHeight * imageRatio
    } else {
      renderedWidth = container.width
      renderedHeight = renderedWidth / imageRatio
    }

    const maxOffsetX = Math.max(0, (renderedWidth - container.width) / 2)
    const maxOffsetY = Math.max(0, (renderedHeight - container.height) / 2)

    const newX = dragState.current.startOffsetX + dx
    const newY = dragState.current.startOffsetY + dy

    setOffset({
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, newX)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, newY)),
    })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragState.current.pointerId === e.pointerId) {
      const target = e.currentTarget as HTMLElement
      try {
        target.releasePointerCapture(e.pointerId)
      } catch {}
      dragState.current.dragging = false
    }
  }

  const onPointerCancel = (e: React.PointerEvent) => {
    if (dragState.current.pointerId === e.pointerId) {
      const target = e.currentTarget as HTMLElement
      try {
        target.releasePointerCapture(e.pointerId)
      } catch {}
      dragState.current.dragging = false
    }
  }

  // ✅ wrapper para esperar el upload.mutate (sin cambiar tu hook)
  const uploadAsync = (file: File) =>
    new Promise<any>((resolve, reject) => {
      upload.mutate(file, {
        onSuccess: resolve,
        onError: reject,
      })
    })

  const handleSave = async () => {
    if (!title.trim() || !date.trim() || !description.trim()) return

    if (date < minDate) {
      showSuccessAlert("No se pueden crear eventos con fechas pasadas")
      return
    }

    setIsSaving(true)
    try {
      let finalIllustration = illustration.trim()

      // ✅ Si hay archivo local, recortamos y subimos SOLO AHORA
      if (pendingFile && localPreview) {
        const blob = await cropToBlob(localPreview, positionAsPercent, CROP_W, CROP_H)
        const croppedFile = blobToFile(blob, `event_${Date.now()}.jpg`)

        const asset = await uploadAsync(croppedFile)
        const url = asset?.url ?? asset?.secure_url
        finalIllustration = url || ""
      }

      // ✅ Si NO hay archivo local, pero hay URL cloudinary pegada,
      // y querés que quede almacenada "real" sin re-subir, NO se puede sin backend.
      // Así que aquí guardamos la URL tal cual (si es cloudinary, podés guardar transformada si querés).
      // Como vos querés archivo real, eso solo aplica a pendingFile (arriba).

      await onSubmit({
        title,
        date,
        description,
        illustration: finalIllustration || "", // tu BD no debe quedar sin valor si es NOT NULL
      } as any)

      // reset
      setTitle("")
      setDate("")
      setDescription("")
      setIllustration("")
      setPendingFile(null)
      if (localPreview) URL.revokeObjectURL(localPreview)
      setLocalPreview("")
      setOffset({ x: 0, y: 0 })

      showSuccessAlert("Evento creado exitosamente")
    } catch (err) {
      console.error("Error al guardar:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setTitle("")
    setDate("")
    setDescription("")
    setIllustration("")
    setPendingFile(null)
    if (localPreview) URL.revokeObjectURL(localPreview)
    setLocalPreview("")
    setOffset({ x: 0, y: 0 })
  }

  const canSave = title.trim() !== "" && date.trim() !== "" && description.trim() !== ""

  return (
    <div className="space-y-4 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      <h3 className="text-xl font-semibold text-[#2E321B] mb-4">Crear Nuevo Evento</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título del evento <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
          placeholder="Ingresa el título del evento"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={75}
          disabled={isSaving || upload.isPending}
        />
        <div className="text-sm text-gray-500 mt-1">Quedan {75 - title.length} de 75 caracteres</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha del evento <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={minDate}
          disabled={isSaving || upload.isPending}
        />
        <div className="text-xs text-gray-500 mt-1">Solo se permiten fechas a partir de hoy</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E] resize-none"
          placeholder="Describe el evento"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={250}
          disabled={isSaving || upload.isPending}
        />
        <div className="text-sm text-gray-500 mt-1">Quedan {250 - description.length} de 250 caracteres</div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Ilustración (opcional)</label>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handlePick}
            disabled={isSaving || upload.isPending}
            className="inline-flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
          >
            {isSaving || upload.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Elegir imagen
          </button>

          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
          />

          <input
            type="text"
            className="flex-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
            placeholder="...o pega una URL (https://...)"
            value={illustration}
            onChange={(e) => {
              // si pega URL, “desactivamos” pendingFile
              setIllustration(e.target.value)
              if (pendingFile) setPendingFile(null)
              if (localPreview) {
                URL.revokeObjectURL(localPreview)
                setLocalPreview("")
              }
            }}
            maxLength={1000}
            disabled={isSaving || upload.isPending}
          />
        </div>

        {previewSrc && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Vista previa (arrastrá para acomodar):
            </p>

            <div
              ref={dragRef}
              className="relative w-full aspect-[1200/630] rounded-lg border-2 border-[#DCD6C9] overflow-hidden bg-[#F8F9F3] cursor-grab active:cursor-grabbing"
              style={{
                touchAction: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
            >
              <img
                ref={imageRef}
                src={previewSrc}
                alt="Vista previa del evento"
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
                style={{
                  objectPosition: `${positionAsPercent.x}% ${positionAsPercent.y}%`,
                  transform: `translate(${offset.x}px, ${offset.y}px)`,
                }}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <ActionButtons
          onSave={handleSave}
          onCancel={handleCancel}
          showCancel={true}
          showSave={true}
          showText={true}
          isSaving={isSaving || upload.isPending}
          disabled={!canSave}
          requireConfirmCancel={hasChanges}
          cancelConfirmText="Los datos ingresados se perderán."
          cancelText="Cancelar"
          saveText="Crear evento"
        />
      </div>
    </div>
  )
}
