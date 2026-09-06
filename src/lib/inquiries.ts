import { getSupabase } from "@/lib/supabase";

/** Public — anyone can submit a "mám záujem" inquiry, no auth required
 * (RLS on product_inquiries allows insert-only for anon). */
export async function submitProductInquiry(input: {
  productId: string | null;
  productName: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}): Promise<void> {
  const { error } = await getSupabase().from("product_inquiries").insert({
    product_id: input.productId,
    product_name: input.productName,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || "",
    message: input.message?.trim() || "",
  });
  if (error) throw error;
}
