import { getSupabase } from "@/lib/supabase";
import { MEDIA_BUCKET } from "./gallery";

export interface ReviewRow {
  id: string;
  author: string;
  body: string;
  image_path: string | null;
  image_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface ReviewItem extends ReviewRow {
  /** resolved image URL for preview, or "" */
  image: string;
}

const COLS =
  "id, author, body, image_path, image_url, sort_order, published, created_at";

function resolve(row: ReviewRow): ReviewItem {
  const image = row.image_path
    ? getSupabase().storage.from(MEDIA_BUCKET).getPublicUrl(row.image_path).data
        .publicUrl
    : (row.image_url ?? "");
  return { ...row, image };
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
}): Promise<ReviewItem> {
  const supabase = getSupabase();

  let image_path: string | null = null;
  const image_url: string | null = input.imageUrl?.trim() || null;

  if (input.imageFile) {
    const ext = (input.imageFile.name.split(".").pop() || "bin").toLowerCase();
    image_path = `reviews/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(image_path, input.imageFile, { cacheControl: "31536000" });
    if (upErr) throw upErr;
  }

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
  patch: Partial<Pick<ReviewRow, "author" | "body" | "published" | "sort_order">>,
): Promise<void> {
  const { error } = await getSupabase()
    .from("reviews")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
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
