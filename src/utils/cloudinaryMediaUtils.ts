export type ViewMode = "small" | "medium" | "large";

export function isVideoUrl(url: string) {
  const u = (url || "").toLowerCase();
  return (
    u.endsWith(".mp4") ||
    u.endsWith(".webm") ||
    u.endsWith(".mov") ||
    u.includes("/video/") ||
    u.includes("resource_type=video")
  );
}

export function formatCount(n: number) {
  return `${n} archivo${n === 1 ? "" : "s"}`;
}

export function addCloudinaryTransform(url: string, transform: string) {
  if (!url) return url;
  const marker = "/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;

  const base = url.slice(0, i + marker.length);
  const rest = url.slice(i + marker.length);

  if (/^v\d+\//.test(rest)) return `${base}${transform}/${rest}`;
  return `${base}${transform}/${rest}`;
}

export function withExtension(url: string, ext: string) {
  if (!url) return url;
  if (/\.(mp4|webm|mov|m3u8|jpg|jpeg|png|webp|avif)(\?|$)/i.test(url)) return url;
  return `${url}.${ext}`;
}

export function videoMp4Url(url: string, view: ViewMode) {
  const w = view === "small" ? 260 : view === "medium" ? 520 : 900;
  const transformed = addCloudinaryTransform(url, `f_mp4,vc_auto,q_auto,w_${w}`);
  return withExtension(transformed, "mp4");
}

export function videoPosterJpg(url: string, view: ViewMode) {
  const w = view === "small" ? 260 : view === "medium" ? 520 : 900;
  const transformed = addCloudinaryTransform(url, `so_0,f_jpg,q_auto,w_${w}`);
  return withExtension(transformed, "jpg");
}
