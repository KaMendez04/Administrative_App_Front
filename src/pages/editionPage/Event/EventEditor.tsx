import React, { useEffect, useMemo, useRef, useState } from "react"
import { showSuccessAlert, showSuccessDeleteAlert } from "../../../utils/alerts"
import { CustomSelect } from "../../../components/CustomSelect"
import { ActionButtons } from "../../../components/ActionButtons"
import { useCloudinaryUpload } from "../../../hooks/Cloudinary/useCloudinaryUpload"
import { Loader2, Upload } from "lucide-react"

const CROP_W = 1200
const CROP_H = 630

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function cropToBlob(
  src: string,
  cropPercent: { x: number; y: number },
  outW = CROP_W,
  outH = CROP_H
): Promise<Blob> {
  const img = await loadImage(src)
  const iw = img.naturalWidth
  const ih = img.naturalHeight

  const scale = Math.max(outW / iw, outH / ih)
  const sw = outW / scale
  const sh = outH / scale

  const cx = (Math.max(0, Math.min(100, cropPercent.x)) / 100) * iw
  const cy = (Math.max(0, Math.min(100, cropPercent.y)) / 100) * ih

  let sx = cx - sw / 2
  let sy = cy - sh / 2

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

export default function EventEditor({
  events,
  selectedEventId,
  setSelectedEventId,
  onUpdate,
  onDelete,
}: any) {
  const selectedEvent = events.find((e: any) => e.id === selectedEventId) || null

  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [illustration, setIllustration] = useState("")

  // ✅ NUEVO: si el usuario escogió un archivo para reemplazar
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string>("")

  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [initialTitle, setInitialTitle] = useState("")
  const [initialDate, setInitialDate] = useState("")
  const [initialDescription, setInitialDescription] = useState("")
  const [initialIllustration, setInitialIllustration] = useState("")
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
    if (selectedEvent) {
      setTitle(selectedEvent.title)
      setDate(selectedEvent.date)
      setDescription(selectedEvent.description)
      setIllustration(selectedEvent.illustration || "")

      setInitialTitle(selectedEvent.title)
      setInitialDate(selectedEvent.date)
      setInitialDescription(selectedEvent.description)
      setInitialIllustration(selectedEvent.illustration || "")

      setPendingFile(null)
      if (localPreview) URL.revokeObjectURL(localPreview)
      setLocalPreview("")
      setOffset({ x: 0, y: 0 })
    } else {
      setTitle("")
      setDate("")
      setDescription("")
      setIllustration("")
      setInitialTitle("")
      setInitialDate("")
      setInitialDescription("")
      setInitialIllustration("")

      setPendingFile(null)
      if (localPreview) URL.revokeObjectURL(localPreview)
      setLocalPreview("")
      setOffset({ x: 0, y: 0 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId])

  useEffect(() => {
    if (!selectedEvent) return
    const changed =
      title !== initialTitle ||
      date !== initialDate ||
      description !== initialDescription ||
      illustration !== initialIllustration ||
      !!pendingFile
    setHasChanges(changed)
  }, [
    title,
    date,
    description,
    illustration,
    initialTitle,
    initialDate,
    initialDescription,
    initialIllustration,
    pendingFile,
    selectedEvent,
  ])

  useEffect(() => {
    setOffset({ x: 0, y: 0 })
  }, [illustration, localPreview])

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  const previewSrc = useMemo(() => {
    if (pendingFile && localPreview) return localPreview
    return illustration || ""
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

  // ✅ NO sube: solo prepara el pendingFile
  const onPickFile = (file: File | null) => {
    if (!file) return
    if (localPreview) URL.revokeObjectURL(localPreview)

    const obj = URL.createObjectURL(file)
    setPendingFile(file)
    setLocalPreview(obj)

    // importante: no tocamos illustration aún
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

  const uploadAsync = (file: File) =>
    new Promise<any>((resolve, reject) => {
      upload.mutate(file, {
        onSuccess: resolve,
        onError: reject,
      })
    })

  const handleSave = async () => {
    if (!selectedEvent) return

    if (date < minDate) {
      showSuccessAlert("No se pueden programar eventos con fechas pasadas")
      return
    }

    setIsSaving(true)
    try {
      let finalIllustration = illustration

      // ✅ si hay archivo nuevo, lo recortamos y lo subimos SOLO AHORA
      if (pendingFile && localPreview) {
        const blob = await cropToBlob(localPreview, positionAsPercent, CROP_W, CROP_H)
        const croppedFile = blobToFile(blob, `event_${selectedEvent.id}_${Date.now()}.jpg`)
        const asset = await uploadAsync(croppedFile)
        const url = asset?.url ?? asset?.secure_url
        finalIllustration = url || ""
      }

      await onUpdate({
        id: selectedEvent.id,
        title,
        date,
        description,
        illustration: finalIllustration || "",
      })

      showSuccessAlert("Actualización completada")

      setInitialTitle(title)
      setInitialDate(date)
      setInitialDescription(description)
      setInitialIllustration(finalIllustration || "")

      // limpiar pending
      setPendingFile(null)
      if (localPreview) URL.revokeObjectURL(localPreview)
      setLocalPreview("")
      setOffset({ x: 0, y: 0 })
    } catch (err) {
      console.error("Error al guardar:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedEvent) return
    setIsDeleting(true)
    try {
      await onDelete(selectedEvent.id)
      showSuccessDeleteAlert("Eliminación completada")
      setSelectedEventId(null)
    } catch (err) {
      console.error("Error al eliminar:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setTitle(initialTitle)
    setDate(initialDate)
    setDescription(initialDescription)
    setIllustration(initialIllustration)

    setPendingFile(null)
    if (localPreview) URL.revokeObjectURL(localPreview)
    setLocalPreview("")
    setSelectedEventId(null)
    setOffset({ x: 0, y: 0 })
  }

  const eventOptions = events.map((event: any) => ({
    value: event.id,
    label: event.title,
  }))

  const canSave = title.trim() !== "" && date.trim() !== "" && description.trim() !== ""

  return (
    <div className="space-y-6 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      <h2 className="text-2xl font-semibold">Editar Evento Existente</h2>

      <CustomSelect
        value={selectedEventId ?? ""}
        onChange={(value) => setSelectedEventId(value ? Number(value) : null)}
        options={eventOptions}
        placeholder="Selecciona un evento para editar"
      />

      {selectedEvent && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del evento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título"
                  maxLength={75}
                  disabled={isSaving || isDeleting || upload.isPending}
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
                  disabled={isSaving || isDeleting || upload.isPending}
                />
                <div className="text-xs text-gray-500 mt-1">Solo se permiten fechas a partir de hoy</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción"
                  maxLength={250}
                  disabled={isSaving || isDeleting || upload.isPending}
                />
                <div className="text-sm text-gray-500 mt-1">Quedan {250 - description.length} de 250 caracteres</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ilustración (opcional)</label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handlePick}
                    disabled={isSaving || isDeleting || upload.isPending}
                    className="inline-flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
                  >
                    {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
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
                    value={illustration}
                    onChange={(e) => {
                      setIllustration(e.target.value)
                      // si escribe URL, cancelamos archivo
                      if (pendingFile) setPendingFile(null)
                      if (localPreview) {
                        URL.revokeObjectURL(localPreview)
                        setLocalPreview("")
                      }
                    }}
                    placeholder="...o pega una URL (https://...)"
                    maxLength={1000}
                    disabled={isSaving || isDeleting || upload.isPending}
                  />
                </div>
              </div>

              {previewSrc && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vista previa (arrastrá para acomodar)
                  </label>

                  <div
                    ref={dragRef}
                    className="relative w-full aspect-[1200/630] rounded-lg border-2 border-[#DCD6C9] overflow-hidden bg-[#F8F9F3] cursor-grab active:cursor-grabbing"
                    style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none" }}
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
                      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <ActionButtons
              onCancel={handleCancel}
              onSave={handleSave}
              onDelete={handleDelete}
              showCancel={true}
              showSave={true}
              showDelete={true}
              showText={true}
              disabled={!canSave}
              isSaving={isSaving || upload.isPending}
              isDeleting={isDeleting}
              requireConfirmCancel={hasChanges}
              requireConfirmDelete={true}
              cancelConfirmText="Los cambios no guardados se perderán."
              deleteConfirmTitle="¿Eliminar evento?"
              deleteConfirmText={`¿Está seguro que desea eliminar el evento "${selectedEvent.title}"? Esta acción no se puede deshacer.`}
              cancelText="Cancelar"
              saveText="Guardar cambios"
              deleteText="Eliminar"
            />
          </div>
        </div>
      )}
    </div>
  )
}
