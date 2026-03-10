import {
  ChevronDown,
  Grid2X2,
  Grid3X3,
  LayoutGrid,
  Loader2,
  Plus,
} from "lucide-react";
import type { ViewMode } from "@/utils/cloudinaryMediaUtils";

type HeaderProps = {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  onOpenPicker: () => void;
  isUploading?: boolean;
  pendingCount?: number;
};

const viewOptions = [
  { value: "small" as ViewMode, label: "Pequeños", icon: Grid3X3 },
  { value: "medium" as ViewMode, label: "Medianos", icon: Grid2X2 },
  { value: "large" as ViewMode, label: "Grandes", icon: LayoutGrid },
];

export default function CloudinaryMediaHeader({
  view,
  setView,
  isDropdownOpen,
  setIsDropdownOpen,
  onOpenPicker,
  isUploading = false,
  pendingCount = 0,
}: HeaderProps) {
  const currentView = viewOptions.find((opt) => opt.value === view);

  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#374321] sm:text-3xl">
          Galería de Medios
        </h1>

        <p className="mt-1 text-sm text-[#6B7280] sm:text-base">
          Subí imágenes o videos y administralos desde aquí.
        </p>

        <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm">
          <span className="text-sm font-semibold text-[#556B2F]">
            Tamaño máximo de archivo:
          </span>
          <span className="text-sm font-bold text-[#708C3E]">10 MB</span>
        </div>
      </div>

      <div className="flex items-end justify-end gap-2 sm:gap-3">
        {/* Dropdown de vista */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex h-10 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 transition hover:border-[#D1D5DB] hover:bg-[#FCFCFA] sm:h-11 sm:px-4"
          >
            {currentView && (
              <currentView.icon className="h-4 w-4 text-[#6B7280]" />
            )}

            <span className="hidden text-sm text-[#33361D] sm:inline">
              {currentView?.label}
            </span>

            <ChevronDown
              className={`h-4 w-4 text-[#6B7280] transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
                {viewOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setView(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                      view === option.value
                        ? "bg-[#F8F9F3] text-[#708C3E]"
                        : "text-[#33361D] hover:bg-[#FAF9F5]"
                    }`}
                  >
                    <option.icon className="h-4 w-4" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Botón agregar / abrir sheet */}
        <button
          type="button"
          onClick={onOpenPicker}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#708C3E] text-white shadow-sm transition hover:bg-[#5D741C] disabled:opacity-70 sm:h-11 sm:w-11"
          title="Agregar archivos"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
          ) : (
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          )}

          {pendingCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#2F3B1B] px-1 text-[10px] font-bold text-white shadow">
              {pendingCount > 99 ? "99+" : pendingCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}