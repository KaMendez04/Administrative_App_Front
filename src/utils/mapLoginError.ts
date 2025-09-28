function isAxiosErr(err: unknown): err is {
  isAxiosError: true;
  message?: string;
  response?: { status?: number };
} {
  return typeof err === 'object'
    && err !== null
    && (err as any).isAxiosError === true;
}

export function mapLoginError(err: unknown): string {
  if (isAxiosErr(err)) {
    const status = err.response?.status;
    switch (status) {
      case 400:
      case 401:
        return 'Contraseña incorrecta, inténtelo de nuevo.';
      case 404:
        return 'Contraseña incorrecta, inténtelo de nuevo.';
      case 429:
        return 'Demasiados intentos. Intente nuevamente más tarde.';
      case 500:
        return 'Error interno del servidor.';
      default:
        return (err as any)?.message || 'Error inesperado. Inténtelo de nuevo.';
    }
  }
  // No es un error de Axios (red caída, CORS, servidor apagado, etc.)
  return 'No se pudo conectar con el servidor.';
}
