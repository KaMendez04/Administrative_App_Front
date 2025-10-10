import { useState } from "react";

type Props = {
  associateId: number;
  associateName: string;
  currentStatus: boolean;
  onToggle: (id: number) => Promise<void>;
  isLoading?: boolean;
};

export function AssociateStatusToggle({ 
  associateId, 
  associateName, 
  currentStatus, 
  onToggle,
  isLoading 
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    await onToggle(associateId);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      {/* Toggle Switch */}
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
          ${currentStatus ? "bg-[#5B732E]" : "bg-gray-300"}
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}
        `}
        aria-label={currentStatus ? "Desactivar asociado" : "Activar asociado"}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out
            ${currentStatus ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>

      {/* Diálogo de confirmación */}
      {showConfirm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={handleCancel}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icono de advertencia */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100">
              <svg 
                className="w-6 h-6 text-amber-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>

            {/* Título */}
            <h3 className="text-xl font-bold text-[#33361D] text-center mb-2">
              {currentStatus ? "¿Desactivar asociado?" : "¿Activar asociado?"}
            </h3>

            {/* Mensaje */}
            <p className="text-sm text-gray-600 text-center mb-6">
              {currentStatus ? (
                <>
                  Estás a punto de <span className="font-semibold text-red-600">desactivar</span> a{" "}
                  <span className="font-semibold text-[#33361D]">{associateName}</span>. 
                  El asociado no podrá acceder a la plataforma hasta que sea reactivado.
                </>
              ) : (
                <>
                  Estás a punto de <span className="font-semibold text-green-600">activar</span> a{" "}
                  <span className="font-semibold text-[#33361D]">{associateName}</span>. 
                  El asociado podrá acceder a la plataforma.
                </>
              )}
            </p>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#EAEFE0] text-[#33361D] font-semibold hover:bg-[#F8F9F3] transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-white shadow-sm transition ${
                  currentStatus 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-[#5B732E] hover:bg-[#556B2F]"
                }`}
              >
                {currentStatus ? "Desactivar" : "Activar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}