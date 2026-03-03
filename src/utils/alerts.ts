import Swal from 'sweetalert2';

(function injectSwalCssOnce() {
  const id = 'swal2-default-styles';
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css';
  document.head.appendChild(link);

  const style = document.createElement('style');
  style.textContent = `
    .no-border-button { border: 0 !important; box-shadow: none !important; }
  `;
  document.head.appendChild(style);
})();

// ─── Configuración base de apariencia (solo fondo + tipografía + icono) ───────

const LIGHT_BG = '#FFFCE6';

const lightClass = {
  popup: 'camara-popup',
  title: 'camara-title',
  htmlContainer: 'camara-text',
  timerProgressBar: 'camara-progress',
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const showSuccessAlertLogin = (message: string) => {
  return Swal.fire({
    icon: 'success',
    title: 'Inicio de sesión exitoso',
    text: message,
    timer: 1500,
    timerProgressBar: true,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    background: LIGHT_BG,
    customClass: { ...lightClass, icon: 'camara-icon-success' },
    heightAuto: false,
    scrollbarPadding: false,
  });
};

export const showErrorAlertLogin = (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: 'Inicio de sesión fallido',
    text: message,
    confirmButtonColor: '#48a6a7',
    customClass: { ...lightClass, confirmButton: 'no-border-button', icon: 'camara-icon-error' },
    background: LIGHT_BG,
    heightAuto: false,
    scrollbarPadding: false,
  });
};

// ─── Registro ─────────────────────────────────────────────────────────────────

export const showSuccessAlertRegister = (message: string) => {
  return Swal.fire({
    icon: 'success',
    title: 'Registro exitoso',
    text: message,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    background: LIGHT_BG,
    customClass: { ...lightClass, icon: 'camara-icon-success' },
    heightAuto: false,
    scrollbarPadding: false,
  });
};

export const showErrorAlertEmpty = (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: 'Formulario inválido',
    text: message,
    background: LIGHT_BG,
    customClass: { ...lightClass, icon: 'camara-icon-error' },
    heightAuto: false,
    scrollbarPadding: false,
  });
};

export const showErrorDuplicateEmail = (message: string) => {
  return Swal.fire({
    icon: 'warning',
    title: 'Email duplicado',
    text: message,
    confirmButtonColor: '#48a6a7',
    customClass: { ...lightClass, confirmButton: 'no-border-button', icon: 'camara-icon-error' },
    background: LIGHT_BG,
    heightAuto: false,
    scrollbarPadding: false,
  });
};

export const showWarningAlert = (message: string) => {
  return Swal.fire({
    title: '¿Desea continuar?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#48a6a7',
    customClass: { ...lightClass, confirmButton: 'no-border-button', icon: 'camara-icon-error' },
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'No, cancelar',
    reverseButtons: false,
    background: LIGHT_BG,
    heightAuto: false,
    scrollbarPadding: false,
  });
};

export const showErrorAlertRegister = (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error al registrar',
    text: message,
    confirmButtonColor: '#48a6a7',
    customClass: { ...lightClass, confirmButton: 'no-border-button', icon: 'camara-icon-error' },
    background: LIGHT_BG,
    heightAuto: false,
    scrollbarPadding: false,
  });
};

// ─── Confirmaciones ───────────────────────────────────────────────────────────

export const showConfirmAlert = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#708C3E',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    reverseButtons: false,
    background: LIGHT_BG,
    customClass: { ...lightClass, icon: 'camara-icon-error' },
    heightAuto: false,
    scrollbarPadding: false,
  });

  return result.isConfirmed;
};

export const showConfirmDeleteAlert = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#708C3E",
    confirmButtonText: "Sí, rechazar",
    cancelButtonText: "Cancelar",
    reverseButtons: false,

    // 👇 ESTO ES LO QUE LO HACE IGUAL
    background: LIGHT_BG,
    customClass: { ...lightClass, icon: "camara-icon-error" },
    heightAuto: false,
    scrollbarPadding: false,
  });

  return result.isConfirmed;
};

export const showConfirmApproveRejectedAlert = async () => {
  const result = await Swal.fire({
    title: 'Aprobar solicitud rechazada',
    text: '¿Estás seguro de querer aprobar a este solicitante que había sido rechazado?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#708C3E',
    cancelButtonColor: '#8C3A33',
    confirmButtonText: 'Sí, aprobar',
    cancelButtonText: 'Cancelar',
    background: LIGHT_BG,
    customClass: { ...lightClass, confirmButton: 'no-border-button', icon: 'camara-icon-error' },
    heightAuto: false,
    scrollbarPadding: false,
  });

  return result.isConfirmed;
};

export const showConfirmOutAlert = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#708C3E',
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar',
    reverseButtons: false,
    background: LIGHT_BG,
    customClass: { ...lightClass, icon: 'camara-icon-error' },
    heightAuto: false,
    scrollbarPadding: false,
  });

  return result.isConfirmed;
};

// ─── Éxito genérico ───────────────────────────────────────────────────────────

export const showSuccessAlert = (message: string) => {
  return Swal.fire({
    icon: 'success',
    title: 'Guardado con éxito',
    text: message,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonColor: '#708C3E',
    background: LIGHT_BG,
    customClass: { ...lightClass, icon: 'camara-icon-success' },
    heightAuto: false,
    scrollbarPadding: false,
  });
};

export const showSuccessDeleteAlert = (message: string) => {
  return Swal.fire({
    icon: 'success',
    title: 'Eliminado con éxito',
    text: message,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonColor: '#708C3E',
    background: LIGHT_BG,
    customClass: { ...lightClass, icon: 'camara-icon-success' },
    heightAuto: false,
    scrollbarPadding: false,
  });
};