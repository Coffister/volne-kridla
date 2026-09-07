import { getSupabase } from "@/lib/supabase";
import { MEDIA_BUCKET } from "./gallery";

export interface ProductVariant {
  type: "color" | "size";
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

function resolveImagePath(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return getSupabase().storage.from(MEDIA_BUCKET).getPublicUrl(pathOrUrl).data.publicUrl;
}

function resolve(row: ProductRow): ProductItem {
  const image = row.image_path
    ? getSupabase().storage.from(MEDIA_BUCKET).getPublicUrl(row.image_path).data
        .publicUrl
    : (row.image_url ?? "");
  const resolvedImages = (row.images ?? []).map(resolveImagePath);
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
  imageFile?: File | null;
  imageUrl?: string;
  additionalImageFiles?: File[];
  variants?: ProductVariant[];
  stockCount?: number;
  inStock?: boolean;
  category?: string;
}): Promise<ProductItem> {
  const supabase = getSupabase();

  let image_path: string | null = null;
  const image_url: string | null = input.imageUrl?.trim() || null;

  if (input.imageFile) {
    const ext = (input.imageFile.name.split(".").pop() || "bin").toLowerCase();
    image_path = `products/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(image_path, input.imageFile, { cacheControl: "31536000" });
    if (upErr) throw upErr;
  }

  const uploadedExtraPaths: string[] = [];
  for (const file of input.additionalImageFiles ?? []) {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const path = `products/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { cacheControl: "31536000" });
    if (upErr) throw upErr;
    uploadedExtraPaths.push(path);
  }

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

export async function addProductImage(item: ProductItem, file: File): Promise<string[]> {
  const supabase = getSupabase();
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `products/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "31536000" });
  if (upErr) throw upErr;

  const nextImages = [...(item.images ?? []), path];
  await updateProduct(item.id, { images: nextImages });
  return nextImages;
}

export async function removeProductImage(item: ProductItem, path: string): Promise<string[]> {
  const nextImages = (item.images ?? []).filter((p) => p !== path);
  await updateProduct(item.id, { images: nextImages });
  if (!path.startsWith("http")) {
    await getSupabase().storage.from(MEDIA_BUCKET).remove([path]);
  }
  return nextImages;
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
