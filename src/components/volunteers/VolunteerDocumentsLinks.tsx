import { useApprovedVolunteerDocsLink, useSolicitudVoluntariadoDocsLink } from "@/hooks/Volunteers/useVolunteerDocsLink"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  mode: "SOLICITUD" | "APROBADO"
  idSolicitud?: number
  approvedParams?: { tipo: "INDIVIDUAL" | "ORGANIZACION"; id: number }
}

export function VolunteerDocsModal({
  open,
  onOpenChange,
  mode,
  idSolicitud,
  approvedParams,
}: Props) {
  // ✅ Hooks SIEMPRE arriba, sin if
  const solicitudLink = useSolicitudVoluntariadoDocsLink()
  const approvedLink = useApprovedVolunteerDocsLink()

  async function handleOpenFolder() {
    try {
      if (mode === "SOLICITUD") {
        if (!idSolicitud) throw new Error("Falta idSolicitud")
        const res = await solicitudLink.mutateAsync(idSolicitud)
        // Ajusta según tu API: res.url / res.link / res
        window.location.href = (res as any).url ?? (res as any).link ?? (res as any)
        return
      }

      // APROBADO
      if (!approvedParams) throw new Error("Faltan parámetros de aprobado")
      const res = await approvedLink.mutateAsync(approvedParams)
      window.location.href = (res as any).url ?? (res as any).link ?? (res as any)
    } catch (e) {
      console.error(e)
      // aquí puedes hacer toast.error(...)
    }
  }

  // ✅ Si vas a retornar null cuando esté cerrado, OK,
  // PERO solo si los hooks ya se llamaron arriba (como aquí).
  if (!open) return null

  return (
    <div>
      {/* tu UI del modal aquí */}
      <button onClick={handleOpenFolder} disabled={solicitudLink.isPending || approvedLink.isPending}>
        Ver carpeta
      </button>

      <button onClick={() => onOpenChange(false)}>Cerrar</button>
    </div>
  )
}