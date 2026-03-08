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

  const handleSave = async () => {
    if (!title.trim() || !cardDescription.trim() || !modalDescription.trim()) return

    setIsSaving(true)
    try {
      let finalImages = [...images];

      // ¡NUEVA LÓGICA AQUÍ!
      // Si el usuario seleccionó un archivo pero no le dio a "Agregar imagen"
      if (pendingFile && localPreview) {
        const blob = await cropToBlob(localPreview, positionAsPercent, CROP_W, CROP_H)
        const croppedFile = blobToFile(blob, `service_${Date.now()}.jpg`)
        const asset = await uploadAsync(croppedFile)
        const url = asset?.url ?? asset?.secure_url
        if (url) {
          finalImages.push(url);
        }
      } 
      // O si el usuario pegó una URL pero no le dio a "Agregar imagen"
      else if (imageUrlDraft.trim() !== "") {
        finalImages.push(imageUrlDraft.trim());
      }

      await onSubmit({
        title,
        cardDescription,
        modalDescription,
        images: finalImages, // ✅ Ahora mandamos el arreglo asegurado
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
    } catch (err: any) {
      console.error("Error al guardar:", err?.response?.data ?? err)
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

        {/* ✅ Lista (sin flechas): ★ portada y ✕ quitar */}
        {images.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Imágenes del servicio (la primera es portada)</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="w-full rounded-xl border border-[#E7E2D7] bg-white p-2 overflow-hidden"
                >
                  <img src={url} className="w-full h-24 object-cover rounded-md" alt={`Imagen ${idx + 1}`} />

                  <div className="mt-3 flex flex-col gap-2">
                    <span className={`text-xs ${idx === 0 ? "text-[#5B732E] font-semibold" : "text-gray-500"}`}>
                      {idx === 0 ? "Portada" : "\u00A0"}
                    </span>

                    <div className="flex items-center justify-end gap-3">
                      {/* ★ Poner como portada (mueve a la posición 0) */}
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) => {
                            if (idx <= 0) return prev
                            const copy = [...prev]
                            const [item] = copy.splice(idx, 1)
                            copy.unshift(item)
                            return copy
                          })
                        }
                        disabled={idx === 0}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg leading-none
                          ${
                            idx === 0
                              ? "bg-[#5B732E] text-white border-[#5B732E]"
                              : "bg-white text-[#5B732E] border-[#5B732E] hover:bg-[#EAEFE0]"
                          }
                          disabled:opacity-60 disabled:cursor-not-allowed`}
                        title={idx === 0 ? "Portada" : "Poner como portada"}
                        aria-label="Poner como portada"
                      >
                        ★
                      </button>

                      {/* ✕ Quitar */}
                      <button
                        type="button"
                        onClick={() => removeAt(idx)}
                        className="w-10 h-10 rounded-xl border border-[#B85C4C] text-[#B85C4C] bg-white hover:bg-[#E6C3B4] flex items-center justify-center text-lg leading-none"
                        title="Quitar"
                        aria-label="Quitar"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500">★ = poner como portada (la mueve a la primera posición).</p>
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