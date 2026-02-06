import { Check, Copy, Eye, Trash2 } from "lucide-react";
import type { ViewMode } from "@/utils/cloudinaryMediaUtils";
import { isVideoUrl, videoMp4Url, videoPosterJpg } from "@/utils/cloudinaryMediaUtils";

type Selected = { url: string; public_id: string; isVideo: boolean };

type Props = {
  view: ViewMode;
  items: any[];
  copiedId: string | null;
  onCopy: (url: string, publicId: string) => void;
  onOpen: (sel: Selected) => void;
  onDelete: (publicId: string) => void;
  isDeleting?: boolean;
};

export default function CloudinaryMediaGrid({
  view,
  items,
  copiedId,
  onCopy,
  onOpen,
  onDelete,
  isDeleting,
}: Props) {
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

  return (
    <div className={`grid gap-3 sm:gap-4 ${gridCols}`}>
      {items.map((it: any) => {
        const url = it.url ?? it.secure_url;
        const isVideo = it.resource_type === "video" || isVideoUrl(url);

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

            <div className="flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 lg:px-8">
              <button
                onClick={() => onCopy(url, it.public_id)}
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
                onClick={() => onOpen({ url, public_id: it.public_id, isVideo })}
                className="inline-flex items-center text-sm font-medium text-[#33361D] hover:text-[#708C3E] transition"
                title="Ver"
              >
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              <button
                onClick={() => onDelete(it.public_id)}
                disabled={!!isDeleting}
                className="inline-flex items-center text-sm font-medium text-[#6B7280] hover:text-red-700 transition disabled:opacity-60"
                title="Eliminar"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
