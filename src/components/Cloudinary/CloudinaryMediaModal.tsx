import type { ViewMode } from "@/utils/cloudinaryMediaUtils";
import { videoMp4Url, videoPosterJpg } from "@/utils/cloudinaryMediaUtils";

type Selected = { url: string; public_id: string; isVideo: boolean };

type Props = {
  selected: Selected | null;
  onClose: () => void;
};

export default function CloudinaryMediaModal({ selected, onClose }: Props) {
  if (!selected) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
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
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#F1F5F9]">
          <div className="text-xs sm:text-sm font-semibold text-[#33361D] truncate pr-2">
            {selected.public_id}
          </div>
          <button
            className="text-xs sm:text-sm font-medium text-[#708C3E] hover:underline whitespace-nowrap"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        <div className="flex-1 bg-black overflow-hidden">
          {selected.isVideo ? (
            <video
              controls
              autoPlay
              className="w-full h-full object-contain"
              poster={videoPosterJpg(selected.url, "large" as ViewMode)}
              onError={(e) => {
                const v = e.currentTarget;
                const source = v.querySelector("source");
                if (source && source.src !== selected.url) {
                  source.src = selected.url;
                  v.load();
                }
              }}
            >
              <source
                src={videoMp4Url(selected.url, "large" as ViewMode)}
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              src={selected.url}
              alt={selected.public_id}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
