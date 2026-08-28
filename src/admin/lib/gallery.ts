import { getSupabase } from "@/lib/supabase";

export const MEDIA_BUCKET = "media";

export interface GalleryRow {
  id: string;
  storage_path: string;
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
}

function publicUrl(path: string): string {
  return getSupabase().storage.from(MEDIA_BUCKET).getPublicUrl(path).data
    .publicUrl;
}

export async function listGallery(): Promise<GalleryItem[]> {
  const { data, error } = await getSupabase()
    .from("gallery_images")
    .select(
      "id, storage_path, alt, width, height, sort_order, published, created_at",
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => ({ ...row, url: publicUrl(row.storage_path) }));
}

async function readImageSize(
  file: File,
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

/** Upload a file to storage and create its gallery_images row (appended last). */
export async function uploadImage(file: File, alt = ""): Promise<GalleryItem> {
  const supabase = getSupabase();

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `gallery/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (upErr) throw upErr;

  const { width, height } = await readImageSize(file);

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
    .insert({ storage_path: path, alt, width, height, sort_order })
    .select(
      "id, storage_path, alt, width, height, sort_order, published, created_at",
    )
    .single();
  if (error) {
    // best-effort cleanup so we don't leave an orphaned object
    await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    throw error;
  }

  return { ...data, url: publicUrl(data.storage_path) };
}

export async function updateImage(
  id: string,
  patch: Partial<Pick<GalleryRow, "alt" | "published" | "sort_order">>,
): Promise<void> {
  const { error } = await getSupabase()
    .from("gallery_images")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteImage(item: GalleryItem): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", item.id);
  if (error) throw error;
  await supabase.storage.from(MEDIA_BUCKET).remove([item.storage_path]);
}

/** Persist a new ordering: writes sort_order = index for every row. */
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
