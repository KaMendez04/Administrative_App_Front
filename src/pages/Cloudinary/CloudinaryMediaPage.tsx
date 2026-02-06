import { useMemo, useRef, useState } from "react";
import {
  Plus,
  Eye,
  Trash2,
  LayoutGrid,
  Grid2X2,
  Grid3X3,
  Loader2,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react";
import { useCloudinaryGallery } from "../../hooks/Cloudinary/useCloudinaryGallery";
import { useCloudinaryUpload } from "../../hooks/Cloudinary/useCloudinaryUpload";
import { useCloudinaryDelete } from "../../hooks/Cloudinary/useCloudinaryDelete";
import { showConfirmDeleteAlert } from "@/utils/alerts"; // ajusta la ruta real

type ViewMode = "small" | "medium" | "large";

function isVideoUrl(url: string) {
  const u = (url || "").toLowerCase();
  return (
    u.endsWith(".mp4") ||
    u.endsWith(".webm") ||
    u.endsWith(".mov") ||
    u.includes("/video/") ||
    u.includes("resource_type=video")
  );
}

function formatCount(n: number) {
  return `${n} archivo${n === 1 ? "" : "s"}`;
}

function addCloudinaryTransform(url: string, transform: string) {
  if (!url) return url;
  const marker = "/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;

  const base = url.slice(0, i + marker.length);
  const rest = url.slice(i + marker.length);

  if (/^v\d+\//.test(rest)) return `${base}${transform}/${rest}`;
  return `${base}${transform}/${rest}`;
}

function withExtension(url: string, ext: string) {
  if (!url) return url;
  // si ya tiene extensión (o query), no la tocamos
  if (/\.(mp4|webm|mov|m3u8|jpg|jpeg|png|webp|avif)(\?|$)/i.test(url)) return url;
  return `${url}.${ext}`;
}

function videoMp4Url(url: string, view: "small" | "medium" | "large") {
  const w = view === "small" ? 260 : view === "medium" ? 520 : 900;
  const transformed = addCloudinaryTransform(url, `f_mp4,vc_auto,q_auto,w_${w}`);
  return withExtension(transformed, "mp4");
}

function videoPosterJpg(url: string, view: "small" | "medium" | "large") {
  const w = view === "small" ? 260 : view === "medium" ? 520 : 900;
  const transformed = addCloudinaryTransform(url, `so_0,f_jpg,q_auto,w_${w}`);
  return withExtension(transformed, "jpg");
}

export default function CloudinaryMediaPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const gallery = useCloudinaryGallery();
  const upload = useCloudinaryUpload();
  const remove = useCloudinaryDelete();

  const onDelete = async (publicId: string) => {
  const ok = await showConfirmDeleteAlert(
    "¿Eliminar archivo?",
    "Esta acción no se puede deshacer."
  );

  if (!ok) return;

  remove.mutate(publicId);
};


  const [view, setView] = useState<ViewMode>("medium");
  const [selected, setSelected] = useState<{
    url: string;
    public_id: string;
    isVideo: boolean;
  } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const items = useMemo(() => {
    const arr = Array.isArray(gallery.data) ? gallery.data : [];
    return [...arr].sort((a: any, b: any) => {
      const da = a?.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b?.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });
  }, [gallery.data]);

  const gridCols =
    view === "small"
      ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
      : view === "medium"
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const aspect =
    view === "small"
      ? "aspect-square"
      : view === "medium"
      ? "aspect-[4/3]"
      : "aspect-[16/10]";

  const openPicker = () => inputRef.current?.click();

  const onPickFile = (file: File | null) => {
    if (!file) return;
    upload.mutate(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const copyToClipboard = async (url: string, publicId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(publicId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const viewOptions = [
    { value: "small" as ViewMode, label: "Pequeños", icon: Grid3X3 },
    { value: "medium" as ViewMode, label: "Medianos", icon: Grid2X2 },
    { value: "large" as ViewMode, label: "Grandes", icon: LayoutGrid },
  ];

  const currentView = viewOptions.find((opt) => opt.value === view);

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header - En columna en móvil, en fila en desktop */}
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
              <span className="text-sm font-bold text-[#708C3E]">
                10&nbsp;MB
              </span>
            </div>

          </div>

          <div className="flex items-end justify-end gap-2">
            {/* Dropdown de Vista - Solo icono en móvil */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#D1D5DB] transition flex items-center gap-2"
              >
                {currentView && (
                  <currentView.icon className="h-4 w-4 text-[#6B7280]" />
                )}
                {/* Texto solo visible en desktop */}
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
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
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

            {/* Botón Agregar - REDONDO */}
            <button
              type="button"
              onClick={openPicker}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#708C3E] text-white shadow-sm hover:bg-[#5d741c] transition flex items-center justify-center disabled:opacity-60"
              disabled={upload.isPending}
              title="Agregar archivo"
            >
              {upload.isPending ? (
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

        {/* Body */}
        <div className="rounded-xl sm:rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-[#F1F5F9]">
            <div className="text-xs sm:text-sm text-[#556B2F] font-medium">
              {formatCount(items.length)}
            </div>
          </div>

          <div className="p-3 sm:p-5">
            {gallery.isLoading && (
              <div className="text-sm text-[#6B7280] text-center py-8">
                Cargando…
              </div>
            )}

            {gallery.isError && (
              <div className="text-sm text-red-700 text-center py-8">
                Error cargando la galería.
              </div>
            )}

            {upload.isError && (
              <div className="mt-3 rounded-lg sm:rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700">
                No se pudo subir el archivo.
              </div>
            )}

            {!gallery.isLoading && !gallery.isError && (
              <div className={`grid gap-3 sm:gap-4 ${gridCols}`}>
                {items.map((it: any) => {
                  const url = it.url ?? it.secure_url;
                  const isVideo =
                    it.resource_type === "video" || isVideoUrl(url);

                  return (
                    <div
                      key={it.public_id}
                      className="rounded-lg sm:rounded-xl border border-[#F1F5F9] hover:border-[#D1D5DB] transition overflow-hidden bg-white"
                    >
                      <div className={`${aspect} bg-[#F8F9F3] relative`}>
                        {isVideo ? (
                          <video
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                            poster={videoPosterJpg(url, view)}
                            onError={(e) => {
                              const v = e.currentTarget;
                              const source = v.querySelector("source");
                              if (source && source.src !== url) {
                                source.src = url;
                                v.load();
                              }
                            }}
                          >
                            <source src={videoMp4Url(url, view)} type="video/mp4" />
                          </video>
                        ) : (
                          <img
                            src={url}
                            alt={it.public_id}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>


                      {/* Acciones: Ver, Copiar, Eliminar */}
                      <div className="flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 lg:px-8">
                        
                            <button
                                onClick={() => copyToClipboard(url, it.public_id)}
                                className="inline-flex items-center text-sm font-medium text-[#33361D] hover:text-[#708C3E] transition"
                                title="Copiar enlace"
                            >
                                {copiedId === it.public_id ? (
                                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                                ) : (
                                <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                )}
                            </button>
                          <button
                            onClick={() =>
                              setSelected({
                                url,
                                public_id: it.public_id,
                                isVideo,
                              })
                            }
                            className="inline-flex items-center text-sm font-medium text-[#33361D] hover:text-[#708C3E] transition"
                            title="Ver"
                          >
                            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => onDelete(it.public_id)}
                            disabled={remove.isPending}
                            className="inline-flex items-center text-sm font-medium text-[#6B7280] hover:text-red-700 transition disabled:opacity-60"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>

                      </div>
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <div className="text-xs sm:text-sm text-[#6B7280] col-span-full text-center py-8 px-4">
                    No hay archivos aún. Presioná el botón <b>+</b> para subir
                    el primero.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="
              w-[min(1100px,100%)]
              h-[min(80vh,720px)]
              rounded-xl sm:rounded-2xl
              bg-white
              overflow-hidden
              shadow-xl
              flex flex-col
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header fijo */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#F1F5F9]">
              <div className="text-xs sm:text-sm font-semibold text-[#33361D] truncate pr-2">
                {selected.public_id}
              </div>
              <button
                className="text-xs sm:text-sm font-medium text-[#708C3E] hover:underline whitespace-nowrap"
                onClick={() => setSelected(null)}
              >
                Cerrar
              </button>
            </div>

            {/* Body fijo */}
            <div className="flex-1 bg-black overflow-hidden">
              {selected.isVideo ? (
                <video
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  poster={videoPosterJpg(selected.url, "large")}
                  onError={(e) => {
                    const v = e.currentTarget
                    const source = v.querySelector("source")
                    if (source && source.src !== selected.url) {
                      source.src = selected.url
                      v.load()
                    }
                  }}
                >
                  <source src={videoMp4Url(selected.url, "large")} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={selected.url}
                  alt={selected.public_id}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}