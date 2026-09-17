import { getSupabase } from "@/lib/supabase";
import { MEDIA_BUCKET } from "./gallery";

export interface ProductVariant {
  /** admin-chosen name, e.g. "Farba ľadvinky", "Veľkosť" */
  label: string;
  /** when true, options are color names from the shared palette (see colorPalette.ts) */
  isColor?: boolean;
  options: string[];
}

export interface ProductRow {
  id: string;
  sku: string;
  name: string;
  description: string;
  price_label: string;
  image_path: string | null;
  image_url: string | null;
  images: string[]; // storage paths or URLs for additional carousel images
  variants: ProductVariant[];
  stock_count: number;
  in_stock: boolean;
  category: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface ProductItem extends ProductRow {
  /** resolved image URL for preview, or "" */
  image: string;
  /** resolved URLs for all carousel images */
  resolvedImages: string[];
}

const COLS =
  "id, sku, name, description, price_label, image_path, image_url, images, variants, stock_count, in_stock, category, sort_order, published, created_at";

export function resolvePhotoUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return getSupabase().storage.from(MEDIA_BUCKET).getPublicUrl(pathOrUrl).data.publicUrl;
}

function resolve(row: ProductRow): ProductItem {
  const image = row.image_path
    ? resolvePhotoUrl(row.image_path)
    : (row.image_url ?? "");
  const resolvedImages = (row.images ?? []).map(resolvePhotoUrl);
  return { ...row, image, resolvedImages };
}

export async function listProducts(): Promise<ProductItem[]> {
  const { data, error } = await getSupabase()
    .from("products")
    .select(COLS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(resolve);
}

export async function createProduct(input: {
  sku?: string;
  name: string;
  description: string;
  priceLabel: string;
  /** ordered photos — the first one becomes the product's main photo */
  photoFiles?: File[];
  imageUrl?: string;
  variants?: ProductVariant[];
  stockCount?: number;
  inStock?: boolean;
  category?: string;
}): Promise<ProductItem> {
  const supabase = getSupabase();

  const uploadedPaths: string[] = [];
  for (const file of input.photoFiles ?? []) {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const path = `products/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { cacheControl: "31536000" });
    if (upErr) throw upErr;
    uploadedPaths.push(path);
  }

  const image_path = uploadedPaths[0] ?? null;
  const image_url = image_path ? null : input.imageUrl?.trim() || null;
  const uploadedExtraPaths = uploadedPaths.slice(1);

  const { data: last } = await supabase
    .from("products")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (last?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("products")
    .insert({
      sku: input.sku?.trim() || "",
      name: input.name.trim(),
      description: input.description.trim(),
      price_label: input.priceLabel.trim(),
      image_path,
      image_url: image_path ? null : image_url,
      images: uploadedExtraPaths,
      variants: input.variants ?? [],
      stock_count: input.stockCount ?? 0,
      in_stock: input.inStock ?? true,
      category: input.category ?? "",
      sort_order,
    })
    .select(COLS)
    .single();

  if (error) {
    if (image_path)
      await supabase.storage.from(MEDIA_BUCKET).remove([image_path]);
    if (uploadedExtraPaths.length)
      await supabase.storage.from(MEDIA_BUCKET).remove(uploadedExtraPaths);
    throw error;
  }
  return resolve(data);
}

export async function updateProduct(
  id: string,
  patch: Partial<
    Pick<
      ProductRow,
      | "sku"
      | "name"
      | "description"
      | "price_label"
      | "published"
      | "sort_order"
      | "variants"
      | "images"
      | "stock_count"
      | "in_stock"
      | "category"
    >
  >,
): Promise<void> {
  const { error } = await getSupabase()
    .from("products")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/** Re-reads the product's photo order from the DB — avoids clobbering a
 *  concurrent change when the caller's cached `item` might be stale
 *  (e.g. adding several photos back-to-back). */
async function currentPhotoRefs(id: string): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from("products")
    .select("image_path, image_url, images")
    .eq("id", id)
    .single();
  if (error) throw error;
  const main = data.image_path ?? data.image_url;
  return main ? [main, ...(data.images ?? [])] : [...(data.images ?? [])];
}

/** Uploads a photo and appends it to the product's photo set (after the current last one). */
export async function addProductPhoto(item: ProductItem, file: File): Promise<string[]> {
  const supabase = getSupabase();
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `products/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "31536000" });
  if (upErr) throw upErr;

  const order = [...(await currentPhotoRefs(item.id)), path];
  await reorderProductImages(item, order);
  return order;
}

/** Removes one photo (main or carousel) by its raw ref; whatever ends up first is the new main. */
export async function removeProductPhoto(
  item: ProductItem,
  ref: string,
): Promise<string[]> {
  const order = (await currentPhotoRefs(item.id)).filter((r) => r !== ref);
  await reorderProductImages(item, order);
  if (!ref.startsWith("http")) {
    await getSupabase().storage.from(MEDIA_BUCKET).remove([ref]);
  }
  return order;
}

/**
 * Reorders a product's photos given the full set as raw refs (storage paths
 * or URLs, same shape as image_path/image_url/images are stored in) — the
 * first ref becomes the new main photo, the rest become the carousel.
 */
export async function reorderProductImages(
  item: ProductItem,
  order: string[],
): Promise<Pick<ProductRow, "image_path" | "image_url" | "images">> {
  const [first, ...rest] = order;
  const patch = {
    image_path: first && !first.startsWith("http") ? first : null,
    image_url: first && first.startsWith("http") ? first : null,
    images: rest,
  };
  const { error } = await getSupabase()
    .from("products")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", item.id);
  if (error) throw error;
  return patch;
}

/** raw ref for a product's current photo set, in display order (main first) */
export function productPhotoRefs(item: ProductItem): string[] {
  const main = item.image_path ?? item.image_url;
  return main ? [main, ...(item.images ?? [])] : [...(item.images ?? [])];
}

export async function deleteProduct(item: ProductItem): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("products").delete().eq("id", item.id);
  if (error) throw error;
  const pathsToRemove: string[] = [];
  if (item.image_path) pathsToRemove.push(item.image_path);
  for (const img of item.images ?? []) {
    if (!img.startsWith("http")) pathsToRemove.push(img);
  }
  if (pathsToRemove.length) {
    await supabase.storage.from(MEDIA_BUCKET).remove(pathsToRemove);
  }
}

export async function reorderProducts(items: ProductItem[]): Promise<void> {
  const supabase = getSupabase();
  await Promise.all(
    items.map((it, i) =>
      it.sort_order === i
        ? Promise.resolve()
        : supabase.from("products").update({ sort_order: i }).eq("id", it.id),
    ),
  );
}
