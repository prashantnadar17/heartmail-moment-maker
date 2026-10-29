export const MAX_PHOTOS = 3;
export const MAX_VIDEOS = 1;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export type MediaKind = "photo" | "video";

export type MediaFileCheck =
  | { ok: true; kind: MediaKind }
  | { ok: false; reason: string };

export function checkMediaFile(file: File): MediaFileCheck {
  if (file.type.startsWith("image/")) {
    if (file.size > MAX_IMAGE_BYTES) {
      return { ok: false, reason: `${file.name} is larger than 10 MB.` };
    }
    return { ok: true, kind: "photo" };
  }
  if (file.type.startsWith("video/")) {
    if (file.size > MAX_VIDEO_BYTES) {
      return {
        ok: false,
        reason: `${file.name} is larger than 50 MB. Try a shorter clip.`,
      };
    }
    return { ok: true, kind: "video" };
  }
  return { ok: false, reason: `${file.name} is not an image or video.` };
}
