export function DefaultNotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <p className="mt-2 text-muted-foreground">
        La ruta no existe o no tienes acceso.
      </p>
      <button
        onClick={() => window.location.assign("/Principal")}
        className="mt-6 inline-flex items-center rounded-lg bg-[#708C3E] px-4 py-2 text-sm font-medium text-white hover:bg-[#5d741c]"
      >
        Volver al inicio
      </button>
    </div>
  );
}