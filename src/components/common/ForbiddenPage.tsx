import { ShieldAlert } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          {/* Icono */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ShieldAlert className="h-7 w-7" />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-semibold tracking-tight">
            Acceso denegado
          </h1>

          {/* Descripción */}
          <p className="mt-2 text-sm text-muted-foreground">
            No tienes permisos para ver esta sección.
            <br />
            Si crees que esto es un error, contacta al administrador.
          </p>

          {/* Acciones */}
          <div className="mt-6 flex w-full gap-3">
            <button
              onClick={() => router.history.back()}
              className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition"
            >
              Volver atrás
            </button>

            <button
              onClick={() => router.navigate({ to: "/Principal" })}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
