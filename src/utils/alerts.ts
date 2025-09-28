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
    title: 'Login successful',
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
    title: 'Login failed',
    text: message,
    confirmButtonColor: '#48a6a7',
    customClass: { confirmButton: 'no-border-button' },
  });
};

export const showSuccessAlertRegister = (message: string) => {
  return Swal.fire({
    icon: 'success',
    title: 'Registration successful',
    text: message,
    timer: 2000,
    showConfirmButton: false,
  });
};

export const showErrorAlertEmpty = (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: 'Invalid form',
    text: message,
  });
};

export const showErrorDuplicateEmail = (message: string) => {
  return Swal.fire({
    icon: 'warning',
    title: 'Duplicate email',
    text: message,
    confirmButtonColor: '#48a6a7',
    customClass: { confirmButton: 'no-border-button' },
  });
};

export const showWarningAlert = (message: string) => {
  return Swal.fire({
    title: 'Delete applicaion?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#48a6a7',
    customClass: { confirmButton: 'no-border-button' },
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'No, cancel',
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
    reverseButtons: true,
    background: "#FAF9F5",
  });
  return result.isConfirmed;
};