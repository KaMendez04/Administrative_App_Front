import { useMemo, useRef, useState } from "react";
import { useCloudinaryGallery } from "../../hooks/Cloudinary/useCloudinaryGallery";
import { useCloudinaryUpload } from "../../hooks/Cloudinary/useCloudinaryUpload";
import { useCloudinaryDelete } from "../../hooks/Cloudinary/useCloudinaryDelete";
import { showConfirmDeleteAlert } from "@/utils/alerts";
import { PaginationBar, usePagination } from "@/components/ui/pagination";
import { formatCount, type ViewMode } from "@/utils/cloudinaryMediaUtils";
import CloudinaryMediaHeader from "@/components/Cloudinary/CloudinaryMediaHeader";
import CloudinaryMediaGrid from "@/components/Cloudinary/CloudinaryMediaGrid";
import CloudinaryMediaModal from "@/components/Cloudinary/CloudinaryMediaModal";

type Selected = { url: string; public_id: string; isVideo: boolean };

export default function CloudinaryMediaPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const gallery = useCloudinaryGallery();
  const upload = useCloudinaryUpload();
  const remove = useCloudinaryDelete();

  const [view, setView] = useState<ViewMode>("medium");
  const [selected, setSelected] = useState<Selected | null>(null);
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

  const pageSize = view === "small" ? 24 : view === "medium" ? 12 : 8;

  const { page, setPage, totalPages, pagedItems, pageItems } = usePagination(
    items,
    pageSize,
    [view, items.length]
  );

  const openPicker = () => inputRef.current?.click();

  const onPickFile = (file: File | null) => {
    if (!file) return;
    upload.mutate(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDelete = async (publicId: string) => {
    const ok = await showConfirmDeleteAlert(
      "¿Eliminar archivo?",
      "Esta acción no se puede deshacer."
    );
    if (!ok) return;
    remove.mutate(publicId);
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

  const openItem = (sel: Selected) => setSelected(sel);

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <CloudinaryMediaHeader
          view={view}
          setView={setView}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          onOpenPicker={openPicker}
          isUploading={upload.isPending}
          inputRef={inputRef as React.RefObject<HTMLInputElement>}
          onPickFile={onPickFile}
        />

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
              <>
                {items.length === 0 ? (
                  <div className="text-xs sm:text-sm text-[#6B7280] text-center py-8 px-4">
                    No hay archivos aún. Presioná el botón <b>+</b> para subir el primero.
                  </div>
                ) : (
                  <>
                    <CloudinaryMediaGrid
                      view={view}
                      items={pagedItems}
                      copiedId={copiedId}
                      onCopy={copyToClipboard}
                      onOpen={openItem}
                      onDelete={onDelete}
                      isDeleting={remove.isPending}
                    />

                    <div className="mt-6">
                      <PaginationBar
                        page={page}
                        totalPages={totalPages}
                        pageItems={pageItems}
                        onPageChange={setPage}
                        className="justify-center"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <CloudinaryMediaModal selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
