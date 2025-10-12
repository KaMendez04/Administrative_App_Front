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
// ------------------------------------------------

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
  });
};


export const showErrorAlertLogin = (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: 'Inicio de sesión fallido',
    text: message,
    confirmButtonColor: '#48a6a7',
    customClass: { confirmButton: 'no-border-button' },
  });
};

export const showSuccessAlertRegister = (message: string) => {
  return Swal.fire({
    icon: 'success',
    title: 'Registro exitoso',
    text: message,
    timer: 2000,
    showConfirmButton: false,
  });
};

export const showErrorAlertEmpty = (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: 'Formulario inválido',
    text: message,
  });
};

export const showErrorDuplicateEmail = (message: string) => {
  return Swal.fire({
    icon: 'warning',
    title: 'Email duplicado',
    text: message,
    confirmButtonColor: '#48a6a7',
    customClass: { confirmButton: 'no-border-button' },
  });
};

export const showWarningAlert = (message: string) => {
  return Swal.fire({
    title: '¿Desea continuar?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#48a6a7',
    customClass: { confirmButton: 'no-border-button' },
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'No, cancelar',
    reverseButtons: false,
  });
};

export const showErrorAlertRegister = (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error al registrar',
    text: message,
    confirmButtonColor: '#48a6a7',
    customClass: { confirmButton: 'no-border-button' },
  });
};

// 🔔 confirmación genérica
export const showConfirmAlert = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#708C3E", // verde de tu paleta
    cancelButtonColor: "#d33",     // rojo suave
    confirmButtonText: "Sí, cancelar",
    cancelButtonText: "No, continuar",
    reverseButtons: false,
    background: "#FAF9F5",
  });
  return result.isConfirmed;
};

// confirmación genérica
export const showConfirmDeleteAlert = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#708C3E", // verde de tu paleta
    cancelButtonColor: "#d33",     // rojo suave
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "No, continuar",
    reverseButtons: false,
    background: "#FAF9F5",
  });
  return result.isConfirmed;
};

// confirmación genérica
export const showConfirmOutAlert = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#708C3E", // verde de tu paleta
    cancelButtonColor: "#d33",     // rojo suave
    confirmButtonText: "Sí, salir",
    cancelButtonText: "No, continuar",
    reverseButtons: false,
    background: "#FAF9F5",
  });
  return result.isConfirmed;
};

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
    background: '#FAF9F5',
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
    background: '#FAF9F5',
  });
};