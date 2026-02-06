import React, { useEffect, useMemo, useRef, useState } from "react"
import { showSuccessAlert, showSuccessDeleteAlert } from "../../../utils/alerts"
import { CustomSelect } from "../../../components/CustomSelect"
import { ActionButtons } from "../../../components/ActionButtons"
import { useCloudinaryUpload } from "../../../hooks/Cloudinary/useCloudinaryUpload"
import { Loader2, Upload } from "lucide-react"

// ✅ usa el utils que te di antes (ajustá la ruta si tu archivo está en otra carpeta)
import { cropToBlob, blobToFile } from "../../../utils/mediaBuildTransformed"

const CROP_W = 1200
const CROP_H = 630

export default function ServicesInformativeEditor({
  items,
  selectedId,
  setSelectedId,
  onUpdate,
  onDelete,
}: any) {
  const selected = items.find((i: any) => i.id === selectedId) ?? null

  const [title, setTitle] = useState("")
  const [cardDescription, setCardDescription] = useState("")
  const [modalDescription, setModalDescription] = useState("")
  const [image, setImage] = useState("")

  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // iniciales
  const [initialTitle, setInitialTitle] = useState("")
  const [initialCardDescription, setInitialCardDescription] = useState("")
  const [initialModalDescription, setInitialModalDescription] = useState("")
  const [initialImage, setInitialImage] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  // ✅ NUEVO: file pendiente (NO se sube hasta guardar)
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

  useEffect(() => {
    if (selected) {
      setTitle(selected.title)
      setCardDescription(selected.cardDescription)
      setModalDescription(selected.modalDescription)
      setImage(selected.image || "")

      setInitialTitle(selected.title)
      setInitialCardDescription(selected.cardDescription)
      setInitialModalDescription(selected.modalDescription)
      setInitialImage(selected.image || "")

      setPendingFile(null)
      if (localPreview) URL.revokeObjectURL(localPreview)
      setLocalPreview("")
      setOffset({ x: 0, y: 0 })
    } else {
      setTitle("")
      setCardDescription("")
      setModalDescription("")
      setImage("")

      setInitialTitle("")
      setInitialCardDescription("")
      setInitialModalDescription("")
      setInitialImage("")

      setPendingFile(null)
      if (localPreview) URL.revokeObjectURL(localPreview)
      setLocalPreview("")
      setOffset({ x: 0, y: 0 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  // cambios
  useEffect(() => {
    if (!selected) return
    const changed =
      title !== initialTitle ||
      cardDescription !== initialCardDescription ||
      modalDescription !== initialModalDescription ||
      image !== initialImage ||
      !!pendingFile
    setHasChanges(changed)
  }, [
    title,
    cardDescription,
    modalDescription,
    image,
    initialTitle,
    initialCardDescription,
    initialModalDescription,
    initialImage,
    pendingFile,
    selected,
  ])

  useEffect(() => {
    setOffset({ x: 0, y: 0 })
  }, [image, localPreview])

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  const previewSrc = useMemo(() => {
    if (pendingFile && localPreview) return localPreview
    return image || ""
  }, [pendingFile, localPreview, image])

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

  const onPickFile = (file: File | null) => {
    if (!file) return

    if (localPreview) URL.revokeObjectURL(localPreview)
    const obj = URL.createObjectURL(file)

    setPendingFile(file)
    setLocalPreview(obj)
    setOffset({ x: 0, y: 0 })

    // si escoge archivo, NO tocamos image todavía (se actualizará al guardar)
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
    if (!selected) return
    setIsSaving(true)
    try {
      let finalImage = image

      // ✅ si hay archivo pendiente, recorta + sube SOLO AHORA
      if (pendingFile && localPreview) {
        const blob = await cropToBlob(localPreview, positionAsPercent, CROP_W, CROP_H)
        const croppedFile = blobToFile(blob, `service_${selected.id}_${Date.now()}.jpg`)

        const asset = await uploadAsync(croppedFile)
        const url = asset?.url ?? asset?.secure_url
        finalImage = url || ""
      }

      await onUpdate({
        id: selected.id,
        title,
        cardDescription,
        modalDescription,
        image: finalImage,
      })

      showSuccessAlert("Actualización completada")

      setInitialTitle(title)
      setInitialCardDescription(cardDescription)
      setInitialModalDescription(modalDescription)
      setInitialImage(finalImage)

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
    if (!selected) return
    setIsDeleting(true)
    try {
      await onDelete(selected.id)
      showSuccessDeleteAlert("Eliminación completada")
      setSelectedId(null)
    } catch (err) {
      console.error("Error al eliminar:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setTitle(initialTitle)
    setCardDescription(initialCardDescription)
    setModalDescription(initialModalDescription)
    setImage(initialImage)

    setPendingFile(null)
    if (localPreview) URL.revokeObjectURL(localPreview)
    setLocalPreview("")
    setSelectedId(null)
    setOffset({ x: 0, y: 0 })
  }

  const serviceOptions = items.map((s: any) => ({
    value: s.id,
    label: s.title,
  }))

  return (
    <div className="space-y-6 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      <h2 className="text-2xl font-semibold mb-6">Editar Servicio Existente</h2>

      <CustomSelect
        value={selectedId ?? ""}
        onChange={(value) => setSelectedId(value ? Number(value) : null)}
        options={serviceOptions}
        placeholder="Selecciona un servicio"
      />

      {selected && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la tarjeta</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  rows={3}
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                  placeholder="Descripción de la tarjeta"
                  maxLength={250}
                  disabled={isSaving || isDeleting || upload.isPending}
                />
                <div className="text-sm text-gray-500 mt-1">Quedan {250 - cardDescription.length} de 250 caracteres</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del modal</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  rows={5}
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  placeholder="Descripción del modal"
                  maxLength={250}
                  disabled={isSaving || isDeleting || upload.isPending}
                />
                <div className="text-sm text-gray-500 mt-1">Quedan {250 - modalDescription.length} de 250 caracteres</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (opcional)</label>

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
                    className="flex-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value)
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
                      alt="Vista previa"
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
              isSaving={isSaving || upload.isPending}
              isDeleting={isDeleting}
              requireConfirmCancel={hasChanges}
              requireConfirmDelete={true}
              cancelConfirmText="Los cambios no guardados se perderán."
              deleteConfirmTitle="¿Eliminar servicio?"
              deleteConfirmText={`¿Está seguro que desea eliminar el servicio "${selected.title}"? Esta acción no se puede deshacer.`}
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
