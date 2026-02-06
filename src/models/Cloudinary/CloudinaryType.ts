export type CloudinaryAsset = {
  public_id: string;
  url: string;
  created_at?: string;
  resource_type?: "image" | "video";
  format?: string;
  bytes?: number;
};