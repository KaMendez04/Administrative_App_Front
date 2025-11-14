// components/ActionButtons.tsx
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Pencil, 
  Trash2, 
  ArrowLeft,
  Download,
  Upload,
  RefreshCw,
  Save,
  Plus,
  Send,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

type ActionButtonsProps = {
  // Acciones existentes
  onView?: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  
  // Acciones
  onDelete?: () => void;
  onBack?: () => void;
  onDownload?: () => void;
  onUpload?: () => void;
  onRefresh?: () => void;
  onSave?: () => void;
  onCreate?: () => void;
  onSend?: () => void;
  onCancel?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  
  // Visibilidad
  showEdit?: boolean;
  showApproveReject?: boolean;
  showDelete?: boolean;
  showBack?: boolean;
  showDownload?: boolean;
  showUpload?: boolean;
  showRefresh?: boolean;
  showSave?: boolean;
  showCreate?: boolean;
  showSend?: boolean;
  showCancel?: boolean;
  showPrevious?: boolean;
  showNext?: boolean;
  disabled?: boolean;
  
  // Estados de carga
  isApproving?: boolean;
  isDeleting?: boolean;
  isSaving?: boolean;
  isUploading?: boolean;
  isLoading?: boolean;
  
  // Configuración
  isReadOnly?: boolean;
  
  // Estados de deshabilitación para navegación
  disablePrevious?: boolean;
  disableNext?: boolean;
  
  // ✨ Tipo de botón para guardar
  saveButtonType?: "button" | "submit";
  
  // Confirmaciones opcionales
  requireConfirmApprove?: boolean;
  requireConfirmReject?: boolean;
  requireConfirmDelete?: boolean;
  requireConfirmCancel?: boolean;
  requireConfirmSave?: boolean;
  
  // Textos personalizables
  approveConfirmTitle?: string;
  approveConfirmText?: string;
  rejectConfirmTitle?: string;
  rejectConfirmText?: string;
  deleteConfirmTitle?: string;
  deleteConfirmText?: string;
  cancelConfirmTitle?: string;
  cancelConfirmText?: string;
  saveConfirmTitle?: string;
  saveConfirmText?: string;
  
  // Textos de botones
  showText?: boolean;
  saveText?: string;
  cancelText?: string;
  backText?: string;
  createText?: string;
  editText?: string;
  deleteText?: string;
  approveText?: string;
  rejectText?: string;
  previousText?: string;
  nextText?: string;
};

export function ActionButtons({
  onView,
  onEdit,
  onApprove,
  onReject,
  onDelete,
  onBack,
  onDownload,
  onUpload,
  onRefresh,
  onSave,
  onCreate,
  onSend,
  onCancel,
  onPrevious,
  onNext,

  disabled = false,
  showEdit = false,
  showApproveReject = false,
  showDelete = false,
  showBack = false,
  showDownload = false,
  showUpload = false,
  showRefresh = false,
  showSave = false,
  showCreate = false,
  showSend = false,
  showCancel = false,
  showPrevious = false,
  showNext = false,
  
  isApproving = false,
  isDeleting = false,
  isSaving = false,
  isUploading = false,
  isLoading = false,
  
  isReadOnly = false,
  
  disablePrevious = false,
  disableNext = false,
  
  saveButtonType = "button",
  
  requireConfirmApprove = false,
  requireConfirmReject = true,
  requireConfirmDelete = true,
  requireConfirmCancel = false,
  requireConfirmSave = false,
  
  approveConfirmTitle = "¿Aprobar?",
  approveConfirmText = "¿Desea aprobar esta solicitud?",
  rejectConfirmTitle = "¿Rechazar?",
  rejectConfirmText = "¿Desea rechazar esta solicitud?",
  deleteConfirmTitle = "¿Eliminar?",
  deleteConfirmText = "Esta acción no se puede deshacer.",
  cancelConfirmTitle = "¿Está seguro?",
  cancelConfirmText = "Los cambios no guardados se perderán.",
  saveConfirmTitle = "¿Guardar cambios?",
  saveConfirmText = "¿Está seguro que desea guardar los cambios?",
  
  showText = false,
  saveText = "Guardar",
  cancelText = "Cancelar",
  backText = "Regresar",
  createText = "Crear",
  editText = "Editar",
  deleteText = "Eliminar",
  approveText = "Aprobar",
  rejectText = "Rechazar",
  previousText = "Anterior",
  nextText = "Siguiente",
}: ActionButtonsProps) {
  
  // Handler para aprobar con confirmación
  const handleApprove = async () => {
    if (requireConfirmApprove) {
      const result = await Swal.fire({
        title: approveConfirmTitle,
        text: approveConfirmText,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#6F8C1F",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, aprobar",
        cancelButtonText: "Cancelar",
        reverseButtons: false,
        background: "#FAF9F5",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-3 font-semibold",
          cancelButton: "rounded-xl px-6 py-3 font-semibold",
        },
      });

      if (result.isConfirmed) {
        onApprove?.();
      }
    } else {
      onApprove?.();
    }
  };

  // Handler para rechazar con confirmación
  const handleReject = async () => {
    if (requireConfirmReject) {
      const result = await Swal.fire({
        title: rejectConfirmTitle,
        text: rejectConfirmText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#B85C4C",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, rechazar",
        cancelButtonText: "Cancelar",
        reverseButtons: false,
        background: "#FAF9F5",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-3 font-semibold",
          cancelButton: "rounded-xl px-6 py-3 font-semibold",
        },
      });

      if (result.isConfirmed) {
        onReject?.();
      }
    } else {
      onReject?.();
    }
  };

  // Handler para eliminar con confirmación
  const handleDelete = async () => {
    if (requireConfirmDelete) {
      const result = await Swal.fire({
        title: deleteConfirmTitle,
        text: deleteConfirmText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#B85C4C",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: false,
        background: "#FAF9F5",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-3 font-semibold",
          cancelButton: "rounded-xl px-6 py-3 font-semibold",
        },
      });

      if (result.isConfirmed) {
        onDelete?.();
      }
    } else {
      onDelete?.();
    }
  };

  // Handler para cancelar con confirmación
  const handleCancel = async () => {
    if (requireConfirmCancel) {
      const result = await Swal.fire({
        title: cancelConfirmTitle,
        text: cancelConfirmText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5B732E",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No, continuar",
        reverseButtons: false,
        background: "#FAF9F5",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-3 font-semibold",
          cancelButton: "rounded-xl px-6 py-3 font-semibold",
        },
      });

      if (result.isConfirmed) {
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  };

  // ✨ Handler para guardar con confirmación
  const handleSave = async () => {
    if (requireConfirmSave) {
      const result = await Swal.fire({
        title: saveConfirmTitle,
        text: saveConfirmText,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#5B732E",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
        reverseButtons: false,
        background: "#FAF9F5",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-3 font-semibold",
          cancelButton: "rounded-xl px-6 py-3 font-semibold",
        },
      });

      if (result.isConfirmed) {
        onSave?.();
      }
    } else {
      onSave?.();
    }
  };

  return (
    <div className="flex gap-2 justify-center items-center">
      {/* Botón Anterior */}
      {showPrevious && onPrevious && (
        <button
          type="button"
          onClick={onPrevious}
          disabled={disablePrevious || disabled}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border-2 border-[#708C3E] text-[#708C3E] text-sm font-semibold hover:bg-[#E6EDC8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white"
          title="Anterior"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
          {showText && <span>{previousText}</span>}
        </button>
      )}

      {/* Botón Siguiente */}
      {showNext && onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={disableNext || disabled}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#708C3E] text-white text-sm font-semibold hover:bg-[#5B732E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300 shadow-sm"
          title="Siguiente"
          aria-label="Siguiente"
        >
          {showText && <span>{nextText}</span>}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Botón Ver */}
      {onView && (
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white border border-[#6B6B6B] text-[#6B6B6B] text-sm font-medium hover:bg-[#ECECEC] hover:text-[#4F4F4F] transition-colors"
          title="Ver detalles"
          aria-label="Ver detalles"
        >
          <Eye className="w-5 h-5" />
          {showText && <span>Ver</span>}
        </button>
      )}

      {/* Botón Editar */}
      {showEdit && onEdit && !isReadOnly && (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white border border-[#A3853D] text-[#A3853D] text-sm font-medium hover:bg-[#F5E6C5] hover:text-[#8B6C2E] transition-colors"
          title="Editar"
          aria-label="Editar"
        >
          <Pencil className="w-5 h-5" />
          {showText && <span>{editText}</span>}
        </button>
      )}

      {/* Botón Guardar */}
      {showSave && onSave && !isReadOnly && (
        <button
          type={saveButtonType}
          onClick={saveButtonType === "button" ? handleSave : undefined}
          disabled={isSaving || disabled}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#5B732E] text-white text-sm font-semibold hover:bg-[#556B2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          title="Guardar"
          aria-label="Guardar"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {showText && <span>Guardando...</span>}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {showText && <span>{saveText}</span>}
            </>
          )}
        </button>
      )}

      {/* Botón Cancelar */}
      {showCancel && onCancel && (
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border-2 border-[#5B732E] text-[#5B732E] text-sm font-semibold hover:bg-[#EAEFE0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Cancelar"
          aria-label="Cancelar"
        >
          <X className="w-4 h-4" />
          {showText && <span>{cancelText}</span>}
        </button>
      )}

      {/* Botón Crear */}
      {showCreate && onCreate && !isReadOnly && (
        <button
          type="button"
          onClick={onCreate}
          disabled={isSaving || disabled}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-[#5B732E] text-white text-sm font-medium hover:bg-[#556B2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Crear"
          aria-label="Crear"
        >
          <Plus className="w-5 h-5" />
          {showText && <span>{createText}</span>}
        </button>
      )}

      {/* Botón Enviar */}
      {showSend && onSend && !isReadOnly && (
        <button
          type="button"
          onClick={onSend}
          disabled={isSaving || disabled}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-[#5B732E] text-white text-sm font-medium hover:bg-[#556B2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Enviar"
          aria-label="Enviar"
        >
          <Send className="w-5 h-5" />
          {showText && <span>Enviar</span>}
        </button>
      )}

      {/* Botones Aprobar/Rechazar */}
      {showApproveReject && !isReadOnly && (
        <>
          {onApprove && (
            <button
              type="button"
              onClick={handleApprove}
              disabled={isApproving}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white border border-[#6F8C1F] text-[#6F8C1F] text-sm font-medium hover:bg-[#E6EDC8] hover:text-[#5A7018] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Aprobar"
              aria-label="Aprobar"
            >
              {isApproving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {showText && <span>{approveText}</span>}
            </button>
          )}
          {onReject && (
            <button
              type="button"
              onClick={handleReject}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white border border-[#B85C4C] text-[#B85C4C] text-sm font-medium hover:bg-[#E6C3B4] hover:text-[#8C3A33] transition-colors"
              title="Rechazar"
              aria-label="Rechazar"
            >
              <XCircle className="w-5 h-5" />
              {showText && <span>{rejectText}</span>}
            </button>
          )}
        </>
      )}

      {/* Botón Eliminar */}
      {showDelete && onDelete && !isReadOnly && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || disabled}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#B85C4C] text-[#B85C4C] text-sm font-medium hover:bg-[#E6C3B4] hover:text-[#8C3A33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Eliminar"
          aria-label="Eliminar"
        >
          {isDeleting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Trash2 className="w-5 h-5" />
          )}
          {showText && <span>{deleteText}</span>}
        </button>
      )}

      {/* Botón Descargar */}
      {showDownload && onDownload && (
        <button
          type="button"
          onClick={onDownload}
          disabled={isLoading || disabled}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white border border-[#6B6B6B] text-[#6B6B6B] text-sm font-medium hover:bg-[#ECECEC] hover:text-[#4F4F4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Descargar"
          aria-label="Descargar"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {showText && <span>Descargar</span>}
        </button>
      )}

      {/* Botón Subir */}
      {showUpload && onUpload && !isReadOnly && (
        <button
          type="button"
          onClick={onUpload}
          disabled={isUploading || disabled}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white border border-[#6B6B6B] text-[#6B6B6B] text-sm font-medium hover:bg-[#ECECEC] hover:text-[#4F4F4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Subir"
          aria-label="Subir"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
          {showText && <span>Subir</span>}
        </button>
      )}

      {/* Botón Actualizar */}
      {showRefresh && onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading || disabled}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white border border-[#6B6B6B] text-[#6B6B6B] text-sm font-medium hover:bg-[#ECECEC] hover:text-[#4F4F4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Actualizar"
          aria-label="Actualizar"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          {showText && <span>Actualizar</span>}
        </button>
      )}

      {/* Botón Regresar */}
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white border border-[#6B6B6B] text-[#6B6B6B] text-sm font-medium hover:bg-[#ECECEC] hover:text-[#4F4F4F] transition-colors"
          title="Regresar"
          aria-label="Regresar"
        >
          <ArrowLeft className="w-5 h-5" />
          {showText && <span>{backText}</span>}
        </button>
      )}
    </div>
  );
}