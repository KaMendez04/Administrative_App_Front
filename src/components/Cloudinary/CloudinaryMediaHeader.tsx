import { ChevronDown, Grid2X2, Grid3X3, LayoutGrid, Loader2, Plus } from "lucide-react";
import type { ViewMode } from "@/utils/cloudinaryMediaUtils";

type HeaderProps = {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  onOpenPicker: () => void;
  isUploading?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onPickFile: (file: File | null) => void;
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
  isUploading,
  inputRef,
  onPickFile,
}: HeaderProps) {
  const currentView = viewOptions.find((opt) => opt.value === view);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#374321]">Galería de Medios</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Subí imágenes o videos y administralos desde aquí.
        </p>

        <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#ffffff] border border-[#E5E7EB] px-3 py-1.5">
          <span className="text-sm font-semibold text-[#556B2F]">
            Tamaño máximo de archivo:
          </span>
          <span className="text-sm font-bold text-[#708C3E]">10&nbsp;MB</span>
        </div>
      </div>

      <div className="flex items-end justify-end gap-2">
        {/* Dropdown de Vista */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#D1D5DB] transition flex items-center gap-2"
          >
            {currentView && <currentView.icon className="h-4 w-4 text-[#6B7280]" />}
            <span className="text-sm text-[#33361D] hidden sm:inline">
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
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-[#E5E7EB] bg-white shadow-lg z-20 overflow-hidden">
                {viewOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setView(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition ${
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

        {/* Botón Agregar */}
        <button
          type="button"
          onClick={onOpenPicker}
          className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#708C3E] text-white shadow-sm hover:bg-[#5d741c] transition flex items-center justify-center disabled:opacity-60"
          disabled={!!isUploading}
          title="Agregar archivo"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*"
          onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}
