// Client-side downscale + re-encode before upload. Event photos straight off a
// phone are 4–10 MB; served as-is they make an album page unusable on mobile.
//
// Produces two files: a full-size copy for the lightbox and a small one for
// grids. WebP where the browser can encode it (Chrome, Firefox, Edge); Safari
// can't encode WebP from a canvas and silently returns PNG, so we detect that
// and use JPEG instead.

const FULL_EDGE = 2000;
// scripts/fetch-content.mjs relies on this value to describe thumbnail widths
const THUMB_EDGE = 800;
const QUALITY = 0.82;

export interface OptimizedImage {
  full: Blob;
  fullExt: string;
  thumb: Blob;
  thumbExt: string;
  width: number;
  height: number;
}

function toBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function encode(
  source: ImageBitmap,
  maxEdge: number,
  type: string,
): Promise<{ blob: Blob; width: number; height: number } | null> {
  const scale = Math.min(1, maxEdge / Math.max(source.width, source.height));
  const width = Math.round(source.width * scale);
  const height = Math.round(source.height * scale);

  // Halve in steps until within 2× of the target. One big drawImage jump
  // (e.g. 4000px → 800px) samples too few source pixels in Safari and leaves
  // the result jagged and soft; successive halvings average them properly.
  let step: CanvasImageSource = source;
  let w = source.width;
  let h = source.height;
  const scratch: HTMLCanvasElement[] = [];
  while (w / 2 >= width && h / 2 >= height) {
    w = Math.round(w / 2);
    h = Math.round(h / 2);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const cx = c.getContext("2d");
    if (!cx) break;
    cx.imageSmoothingQuality = "high";
    cx.drawImage(step, 0, 0, w, h);
    scratch.push(c);
    step = c;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(step, 0, 0, width, height);
  for (const c of scratch) c.width = c.height = 0;

  const blob = await toBlob(canvas, type, QUALITY);
  // free the backing store right away — iOS caps total canvas memory and a
  // 40-photo batch would otherwise hit it
  canvas.width = canvas.height = 0;
  if (!blob || blob.type !== type) return null;
  return { blob, width, height };
}

/**
 * Returns null when the browser can't decode the file (e.g. HEIC outside
 * Safari) — the caller then uploads the original untouched.
 */
export async function optimizeImage(file: File): Promise<OptimizedImage | null> {
  // animated / vector formats would lose what makes them what they are
  if (file.type === "image/gif" || file.type === "image/svg+xml") return null;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return null;
  }

  try {
    for (const [type, ext] of [
      ["image/webp", "webp"],
      ["image/jpeg", "jpg"],
    ] as const) {
      const full = await encode(bitmap, FULL_EDGE, type);
      if (!full) continue;
      const thumb = await encode(bitmap, THUMB_EDGE, type);
      if (!thumb) continue;
      // an already-small, already-compressed file can come out bigger after
      // re-encoding — keep the original bytes then
      const keepOriginal =
        full.width === bitmap.width &&
        full.blob.size >= file.size &&
        (file.type === "image/jpeg" || file.type === "image/webp");
      return {
        full: keepOriginal ? file : full.blob,
        fullExt: keepOriginal ? (file.type === "image/webp" ? "webp" : "jpg") : ext,
        thumb: thumb.blob,
        thumbExt: ext,
        width: full.width,
        height: full.height,
      };
    }
    return null;
  } finally {
    bitmap.close();
  }
}
