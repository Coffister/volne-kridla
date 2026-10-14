import { getSupabase } from "@/lib/supabase";
import { MEDIA_BUCKET } from "./gallery";
import { optimizeImage } from "./optimizeImage";

export interface ReviewRow {
  id: string;
  author: string;
  body: string;
  image_path: string | null;
  image_url: string | null;
  /** focal point of the photo in percent (CSS object-position) */
  image_pos_x: number;
  image_pos_y: number;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface ReviewItem extends ReviewRow {
  /** resolved image URL for preview, or "" */
  image: string;
}

// "*" rather than an explicit list so the page keeps working before
// 0015_reviews_image_position.sql is applied — the position falls back below
const COLS = "*";

function resolve(row: ReviewRow): ReviewItem {
  const image = row.image_path
    ? getSupabase().storage.from(MEDIA_BUCKET).getPublicUrl(row.image_path).data
        .publicUrl
    : (row.image_url ?? "");
  return {
    ...row,
    image_pos_x: row.image_pos_x ?? 50,
    image_pos_y: row.image_pos_y ?? 0,
    image,
  };
}

/** Uploads a review photo, downscaled to the 800px thumb — the card shows it
 * at a few hundred px, a phone original would be megabytes. */
async function uploadPhoto(file: File): Promise<string> {
  const optimized = await optimizeImage(file);
  const blob = optimized?.thumb ?? file;
  const ext = optimized?.thumbExt ?? (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `reviews/${crypto.randomUUID()}.${ext}`;
  const { error } = await getSupabase()
    .storage.from(MEDIA_BUCKET)
    .upload(path, blob, { cacheControl: "31536000", contentType: blob.type || undefined });
  if (error) throw error;
  return path;
}

export async function listReviews(): Promise<ReviewItem[]> {
  const { data, error } = await getSupabase()
    .from("reviews")
    .select(COLS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(resolve);
}

export async function createReview(input: {
  author: string;
  body: string;
  imageFile?: File | null;
  imageUrl?: string;
  /** focal point chosen in the crop dialog before saving */
  imagePos?: { x: number; y: number };
}): Promise<ReviewItem> {
  const supabase = getSupabase();

  let image_path: string | null = null;
  const image_url: string | null = input.imageUrl?.trim() || null;

  if (input.imageFile) image_path = await uploadPhoto(input.imageFile);

  const { data: last } = await supabase
    .from("reviews")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (last?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      author: input.author.trim(),
      body: input.body.trim(),
      image_path,
      image_url: image_path ? null : image_url,
      ...(input.imagePos
        ? { image_pos_x: input.imagePos.x, image_pos_y: input.imagePos.y }
        : {}),
      sort_order,
    })
    .select(COLS)
    .single();

  if (error) {
    if (image_path)
      await supabase.storage.from(MEDIA_BUCKET).remove([image_path]);
    throw error;
  }
  return resolve(data);
}

export async function updateReview(
  id: string,
  patch: Partial<
    Pick<
      ReviewRow,
      "author" | "body" | "published" | "sort_order" | "image_pos_x" | "image_pos_y"
    >
  >,
): Promise<void> {
  const { error } = await getSupabase()
    .from("reviews")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/** Swaps the photo for a new upload (also replaces an old external URL);
 * the framing starts over, since it was set for the previous photo. */
export async function replaceReviewImage(item: ReviewItem, file: File): Promise<ReviewItem> {
  const supabase = getSupabase();
  const image_path = await uploadPhoto(file);
  const { data, error } = await supabase
    .from("reviews")
    .update({
      image_path,
      image_url: null,
      image_pos_x: 50,
      image_pos_y: 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", item.id)
    .select(COLS)
    .single();
  if (error) {
    await supabase.storage.from(MEDIA_BUCKET).remove([image_path]);
    throw error;
  }
  if (item.image_path) await supabase.storage.from(MEDIA_BUCKET).remove([item.image_path]);
  return resolve(data);
}

export async function deleteReview(item: ReviewItem): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("reviews").delete().eq("id", item.id);
  if (error) throw error;
  if (item.image_path)
    await supabase.storage.from(MEDIA_BUCKET).remove([item.image_path]);
}

export async function reorderReviews(items: ReviewItem[]): Promise<void> {
  const supabase = getSupabase();
  await Promise.all(
    items.map((it, i) =>
      it.sort_order === i
        ? Promise.resolve()
        : supabase.from("reviews").update({ sort_order: i }).eq("id", it.id),
    ),
  );
}
