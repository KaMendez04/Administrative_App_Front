import { Eye, CheckCircle, XCircle, Pencil } from "lucide-react";

type ActionButtonsProps = {
  onView?: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  showEdit?: boolean;
  showApproveReject?: boolean;
  isApproving?: boolean;
  isReadOnly?: boolean;
};

export function ActionButtons({
  onView,
  onEdit,
  onApprove,
  onReject,
  showEdit = false,
  showApproveReject = false,
  isApproving = false,
  isReadOnly = false,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2 justify-center items-center">
      {/* Botón Ver */}
      {onView && (
        <button
          onClick={onView}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white border border-[#6B6B6B] text-[#6B6B6B] text-sm font-medium hover:bg-[#ECECEC] hover:text-[#4F4F4F] transition-colors"
          title="Ver detalles"
          aria-label="Ver detalles"
        >
          <Eye className="w-5 h-5" />
        </button>
      )}

      {/* Botón Editar */}
      {showEdit && onEdit && !isReadOnly && (
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white border border-[#A3853D] text-[#A3853D] text-sm font-medium hover:bg-[#F5E6C5] hover:text-[#8B6C2E] transition-colors"
          title="Editar"
          aria-label="Editar"
        >
          <Pencil className="w-5 h-5" />
        </button>
      )}

      {/* Botones Aprobar/Rechazar */}
      {showApproveReject && !isReadOnly && (
        <>
          {onApprove && (
            <button
              onClick={onApprove}
              disabled={isApproving}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white border border-[#6F8C1F] text-[#6F8C1F] text-sm font-medium hover:bg-[#E6EDC8] hover:text-[#5A7018] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Aprobar"
              aria-label="Aprobar"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white border border-[#B85C4C] text-[#B85C4C] text-sm font-medium hover:bg-[#E6C3B4] hover:text-[#8C3A33] transition-colors"
              title="Rechazar"
              aria-label="Rechazar"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </>
      )}
    </div>
  );
}