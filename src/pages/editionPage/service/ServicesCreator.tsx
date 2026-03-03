import React, { useEffect, useMemo, useRef, useState } from "react"
import { showSuccessAlert } from "../../../utils/alerts"
import { ActionButtons } from "../../../components/ActionButtons"
import { useCloudinaryUpload } from "../../../hooks/Cloudinary/useCloudinaryUpload"
import { Loader2, Upload } from "lucide-react"

// ✅ usa el utils que te di antes (ajustá la ruta si tu archivo está en otra carpeta)
import { cropToBlob, blobToFile } from "../../../utils/mediaBuildTransformed"

const CROP_W = 1200
const CROP_H = 630

export default function ServicesInformativeCreator({ onSubmit }: any) {
  const [title, setTitle] = useState("")
  const [cardDescription, setCardDescription] = useState("")
  const [modalDescription, setModalDescription] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imageUrlDraft, setImageUrlDraft] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // ✅ file pendiente (NO se sube hasta agregar)
  const upload = useCloudinaryUpload()
  const fileRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string>("")

  // drag/crop
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

  // Detectar cambios
  useEffect(() => {
    const changed =
      title.trim() !== "" ||
      cardDescription.trim() !== "" ||
      modalDescription.trim() !== "" ||
      imageUrlDraft.trim() !== "" ||
      images.length > 0 ||
      !!pendingFile
    setHasChanges(changed)
  }, [title, cardDescription, modalDescription, imageUrlDraft, images.length, pendingFile])

  // reset offset cuando cambia preview
  useEffect(() => {
    setOffset({ x: 0, y: 0 })
  }, [localPreview, imageUrlDraft])

  // liberar objectURL
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  // src para preview (archivo seleccionado tiene prioridad; si no, muestra la URL draft)
  const previewSrc = useMemo(() => {
    if (pendingFile && localPreview) return localPreview
    return imageUrlDraft || ""
  }, [pendingFile, localPreview, imageUrlDraft])

  // convertir offset -> percent para recorte
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

  // ✅ NO sube todavía: solo guarda file + preview local
  const onPickFile = (file: File | null) => {
    if (!file) return

    if (localPreview) URL.revokeObjectURL(localPreview)
    const obj = URL.createObjectURL(file)

    setPendingFile(file)
    setLocalPreview(obj)

    // si escoge archivo, vaciamos el input de URL para evitar confusión
    setImageUrlDraft("")
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

  // wrapper para esperar upload.mutate
  const uploadAsync = (file: File) =>
    new Promise<any>((resolve, reject) => {
      upload.mutate(file, {
        onSuccess: resolve,
        onError: reject,
      })
    })

  // ✅ Agregar imagen por URL
  const addFromUrl = () => {
    const url = imageUrlDraft.trim()
    if (!url) return
    setImages((prev) => [...prev, url])
    setImageUrlDraft("")
    setOffset({ x: 0, y: 0 })
  }

  // ✅ Agregar imagen desde archivo (recorta + sube y guarda URL)
  const addFromFile = async () => {
    if (!pendingFile || !localPreview) return
    try {
      const blob = await cropToBlob(localPreview, positionAsPercent, CROP_W, CROP_H)
      const croppedFile = blobToFile(blob, `service_${Date.now()}.jpg`)

      const asset = await uploadAsync(croppedFile)
      const url = asset?.url ?? asset?.secure_url
      if (!url) return

      setImages((prev) => [...prev, url])

      setPendingFile(null)
      if (localPreview) URL.revokeObjectURL(localPreview)
      setLocalPreview("")
      setOffset({ x: 0, y: 0 })
    } catch (e) {
      console.error("Error subiendo imagen:", e)
    }
  }

  const removeAt = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx))

  const move = (from: number, to: number) =>
    setImages((prev) => {
      if (to < 0 || to >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(from, 1)
      copy.splice(to, 0, item)
      return copy
    })

  const handleSave = async () => {
    if (!title.trim() || !cardDescription.trim() || !modalDescription.trim()) return

    setIsSaving(true)
    try {
      await onSubmit({
        title,
        cardDescription,
        modalDescription,
        images, // ✅ guarda la lista (primera = portada)
      })

      // limpiar
      setTitle("")
      setCardDescription("")
      setModalDescription("")
      setImages([])
      setImageUrlDraft("")
      setPendingFile(null)
      if (localPreview) URL.revokeObjectURL(localPreview)
      setLocalPreview("")
      setOffset({ x: 0, y: 0 })

      showSuccessAlert("Servicio creado exitosamente")
    } catch (err) {
      console.error("Error al guardar:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setTitle("")
    setCardDescription("")
    setModalDescription("")
    setImages([])
    setImageUrlDraft("")
    setPendingFile(null)
    if (localPreview) URL.revokeObjectURL(localPreview)
    setLocalPreview("")
    setOffset({ x: 0, y: 0 })
  }

  const canSave = title.trim() !== "" && cardDescription.trim() !== "" && modalDescription.trim() !== ""

  const canAdd = (!!pendingFile && !!localPreview) || imageUrlDraft.trim() !== ""

  return (
    <div className="space-y-4 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      <h3 className="text-xl font-semibold text-[#2E321B] mb-4">Crear Nuevo Servicio</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
          placeholder="Título del servicio"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={75}
          disabled={isSaving || upload.isPending}
        />
        <div className="text-sm text-gray-500 mt-1">Quedan {75 - title.length} de 75 caracteres</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción de la tarjeta <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E] resize-none"
          rows={3}
          placeholder="Descripción breve que aparecerá en la tarjeta"
          value={cardDescription}
          onChange={(e) => setCardDescription(e.target.value)}
          maxLength={250}
          disabled={isSaving || upload.isPending}
        />
        <div className="text-sm text-gray-500 mt-1">Quedan {250 - cardDescription.length} de 250 caracteres</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción del modal <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E] resize-none"
          rows={5}
          placeholder="Descripción detallada que aparecerá en el modal"
          value={modalDescription}
          onChange={(e) => setModalDescription(e.target.value)}
          maxLength={250}
          disabled={isSaving || upload.isPending}
        />
        <div className="text-sm text-gray-500 mt-1">Quedan {250 - modalDescription.length} de 250 caracteres</div>
      </div>

      {/* ✅ Imagen: archivo (no sube) + URL opcional */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (opcional)</label>

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
            className="flex-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
            placeholder="...o pega una URL (https://...)"
            value={imageUrlDraft}
            onChange={(e) => {
              setImageUrlDraft(e.target.value)
              // si escribe URL, cancelamos archivo local
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
            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa (arrastrá para acomodar):</p>

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
                alt="Vista previa"
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

        {/* ✅ Agregar a lista */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={pendingFile ? addFromFile : addFromUrl}
            disabled={!canAdd || isSaving || upload.isPending}
            className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
          >
            Agregar imagen
          </button>
          <span className="text-sm text-gray-500">La primera imagen será la portada.</span>
        </div>

        {/* ✅ Lista con orden */}
        {images.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Imágenes del servicio (la primera es portada)</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((url, idx) => (
                <div key={`${url}-${idx}`} className="border rounded-lg p-2 space-y-2">
                  <img src={url} className="w-full h-24 object-cover rounded-md" />
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className={idx === 0 ? "text-green-700 font-semibold" : "text-gray-500"}>
                      {idx === 0 ? "Portada" : `#${idx + 1}`}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => move(idx, idx - 1)} disabled={idx === 0} className="px-2 border rounded">
                        ↑
                      </button>
                      <button
                        onClick={() => move(idx, idx + 1)}
                        disabled={idx === images.length - 1}
                        className="px-2 border rounded"
                      >
                        ↓
                      </button>
                      <button onClick={() => removeAt(idx)} className="px-2 border rounded">
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
          saveText="Crear servicio"
        />
      </div>
    </div>
  )
}