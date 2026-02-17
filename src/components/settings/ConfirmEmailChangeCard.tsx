import { Button } from "@/components/ui/button"
import {
  adminCard,
  adminCardHeader,
  adminCardBody,
  adminTitle,
  adminDescription,
  adminPrimaryBtn,
} from "@/utils/adminStyles"

type Props = {
  token?: string
  loading: boolean
  onConfirm: () => void
}

export default function ConfirmEmailChangeCard({ token, loading, onConfirm }: Props) {
  const hasToken = !!token

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10">
      <div className={adminCard}>
        <div className={adminCardHeader}>
          <h1 className={adminTitle}>Confirmar cambio de correo</h1>
          <p className={adminDescription}>
            {hasToken
              ? "Presiona el botón para confirmar el cambio de correo."
              : "No se encontró el token. Abre el enlace desde el correo que recibiste."}
          </p>
        </div>

        <div className={adminCardBody}>
          <Button
            className={`${adminPrimaryBtn} w-full`}
            disabled={!hasToken || loading}
            onClick={onConfirm}
          >
            {loading ? "Confirmando..." : "Confirmar correo"}
          </Button>
        </div>
      </div>
    </div>
  )
}
