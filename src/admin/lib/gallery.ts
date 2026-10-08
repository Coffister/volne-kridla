import { getSupabase } from "@/lib/supabase";
import { optimizeImage } from "./optimizeImage";

export const MEDIA_BUCKET = "media";

export interface GalleryRow {
  id: string;
  storage_path: string;
  thumb_path: string | null;
  album_id: string | null;
  alt: string;
  width: number | null;
  height: number | null;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface GalleryItem extends GalleryRow {
  /** resolved public URL for <img src> */
  url: string;
  /** small copy for the admin grid; falls back to url for older uploads */
  thumbUrl: string;
}

export interface AlbumRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  event_date: string | null;
  cover_image_id: string | null;
  published: boolean;
  created_at: string;
}

const IMAGE_COLUMNS =
  "id, storage_path, thumb_path, album_id, alt, width, height, sort_order, published, created_at";
const ALBUM_COLUMNS =
  "id, slug, title, description, event_date, cover_image_id, published, created_at";

function publicUrl(path: string): string {
  return getSupabase().storage.from(MEDIA_BUCKET).getPublicUrl(path).data
    .publicUrl;
}

function toItem(row: GalleryRow): GalleryItem {
  const url = publicUrl(row.storage_path);
  return { ...row, url, thumbUrl: row.thumb_path ? publicUrl(row.thumb_path) : url };
}

export async function listGallery(): Promise<GalleryItem[]> {
  const { data, error } = await getSupabase()
    .from("gallery_images")
    .select(IMAGE_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(toItem);
}

async function readImageSize(
  file: Blob,
): Promise<{ width: number | null; height: number | null }> {
  try {
    const bmp = await createImageBitmap(file);
    const size = { width: bmp.width, height: bmp.height };
    bmp.close();
    return size;
  } catch {
    return { width: null, height: null };
  }
}

/**
 * Optimize, upload to storage and create the gallery_images row (appended
 * last), optionally straight into an album.
 */
export async function uploadImage(
  file: File,
  albumId: string | null = null,
): Promise<GalleryItem> {
  const supabase = getSupabase();
  const bucket = supabase.storage.from(MEDIA_BUCKET);
  const id = crypto.randomUUID();
  const opts = { cacheControl: "31536000", upsert: false };

  const optimized = await optimizeImage(file);
  let path: string;
  let thumb_path: string | null = null;
  let size: { width: number | null; height: number | null };

  if (optimized) {
    path = `gallery/${id}.${optimized.fullExt}`;
    thumb_path = `gallery/${id}-thumb.${optimized.thumbExt}`;
    const [a, b] = await Promise.all([
      bucket.upload(path, optimized.full, { ...opts, contentType: optimized.full.type }),
      bucket.upload(thumb_path, optimized.thumb, { ...opts, contentType: optimized.thumb.type }),
    ]);
    const upErr = a.error ?? b.error;
    if (upErr) {
      await bucket.remove([path, thumb_path]);
      throw upErr;
    }
    size = { width: optimized.width, height: optimized.height };
  } else {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    path = `gallery/${id}.${ext}`;
    const { error: upErr } = await bucket.upload(path, file, opts);
    if (upErr) throw upErr;
    size = await readImageSize(file);
  }

  // place at the end
  const { data: last } = await supabase
    .from("gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (last?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("gallery_images")
    .insert({
      storage_path: path,
      thumb_path,
      album_id: albumId,
      alt: "",
      ...size,
      sort_order,
    })
    .select(IMAGE_COLUMNS)
    .single();
  if (error) {
    // best-effort cleanup so we don't leave orphaned objects
    await bucket.remove(thumb_path ? [path, thumb_path] : [path]);
    throw error;
  }

  return toItem(data);
}

export async function updateImage(
  id: string,
  patch: Partial<Pick<GalleryRow, "alt" | "published" | "sort_order" | "album_id">>,
): Promise<void> {
  const { error } = await getSupabase()
    .from("gallery_images")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/** Move several photos into an album (or out of every album with null). */
export async function moveToAlbum(
  ids: string[],
  albumId: string | null,
): Promise<void> {
  if (!ids.length) return;
  const { error } = await getSupabase()
    .from("gallery_images")
    .update({ album_id: albumId, updated_at: new Date().toISOString() })
    .in("id", ids);
  if (error) throw error;
}

export async function deleteImage(item: GalleryItem): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", item.id);
  if (error) throw error;
  await supabase.storage
    .from(MEDIA_BUCKET)
    .remove(item.thumb_path ? [item.storage_path, item.thumb_path] : [item.storage_path]);
}

/**
 * Persist a new ordering. `items` is the full list in its new order; only
 * rows whose position changed are written.
 */
export async function reorder(items: GalleryItem[]): Promise<void> {
  const supabase = getSupabase();
  await Promise.all(
    items.map((it, i) =>
      it.sort_order === i
        ? Promise.resolve()
        : supabase
            .from("gallery_images")
            .update({ sort_order: i })
            .eq("id", it.id),
    ),
  );
}

// ------------------------------------------------------------------ albums --

export async function listAlbums(): Promise<AlbumRow[]> {
  const { data, error } = await getSupabase()
    .from("gallery_albums")
    .select(ALBUM_COLUMNS)
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** "Letný tréning 2026" → "letny-trening-2026" */
export function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "album"
  );
}

export async function createAlbum(
  title: string,
  existing: AlbumRow[],
): Promise<AlbumRow> {
  // the slug is the album's public URL — fixed at creation so renaming the
  // album later doesn't break links already shared on social media
  const base = slugify(title);
  const taken = new Set(existing.map((a) => a.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

  const { data, error } = await getSupabase()
    .from("gallery_albums")
    .insert({ title, slug })
    .select(ALBUM_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function updateAlbum(
  id: string,
  patch: Partial<
    Pick<AlbumRow, "title" | "description" | "event_date" | "cover_image_id" | "published">
  >,
): Promise<void> {
  const { error } = await getSupabase()
    .from("gallery_albums")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/** Deletes the album only — its photos become "nezaradené". */
export async function deleteAlbum(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from("gallery_albums")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
