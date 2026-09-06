import { getSupabase } from "@/lib/supabase";

export interface InquiryRow {
  id: string;
  product_id: string | null;
  product_name: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  handled: boolean;
  created_at: string;
}

const COLS =
  "id, product_id, product_name, name, email, phone, message, handled, created_at";

export async function listInquiries(): Promise<InquiryRow[]> {
  const { data, error } = await getSupabase()
    .from("product_inquiries")
    .select(COLS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function setInquiryHandled(id: string, handled: boolean): Promise<void> {
  const { error } = await getSupabase()
    .from("product_inquiries")
    .update({ handled })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteInquiry(id: string): Promise<void> {
  const { error } = await getSupabase().from("product_inquiries").delete().eq("id", id);
  if (error) throw error;
}
