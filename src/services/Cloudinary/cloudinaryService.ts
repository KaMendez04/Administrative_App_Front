import type { CloudinaryAsset } from "@/models/Cloudinary/CloudinaryType";
import apiConfig from "../../apiConfig/apiConfig";

function ensureArray<T = any>(x: any): T[] {
  if (Array.isArray(x)) return x;
  if (!x || typeof x !== "object") return [];
  if (Array.isArray(x.items)) return x.items;
  if (Array.isArray(x.resources)) return x.resources;
  if (Array.isArray(x.data)) return x.data;
  return [];
}

function normalizeAsset(r: any): CloudinaryAsset | null {
  const public_id = r?.public_id;
  const url = r?.url ?? r?.secure_url;
  if (!public_id || !url) return null;

  const resource_type =
    r?.resource_type === "video" || r?.resource_type === "image"
      ? r.resource_type
      : undefined;

  return {
    public_id,
    url,
    created_at: r?.created_at,
    resource_type,
    format: r?.format,
    bytes: r?.bytes,
  };
}

export const cloudinaryService = {
  async list() {
    const { data } = await apiConfig.get<any>("/cloudinary/gallery");

    const arr = ensureArray<any>(data);
    const normalized = arr.map(normalizeAsset).filter(Boolean) as CloudinaryAsset[];

    return normalized;
  },

  async upload(file: File) {
    const form = new FormData();
    form.append("file", file);

    const { data } = await apiConfig.post<any>("/cloudinary/upload", form);
    const url = data?.url ?? data?.secure_url;

    return {
      public_id: data?.public_id,
      url,
      resource_type: data?.resource_type,
    } as CloudinaryAsset;
  },

  async remove(publicId: string) {
    return apiConfig.delete(`/cloudinary/${encodeURIComponent(publicId)}`);
  },
};