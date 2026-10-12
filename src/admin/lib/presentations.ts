import { getSupabase } from "@/lib/supabase";

export interface PresentationInquiryRow {
  id: string;
  inviter_kind: string;
  subtype: string;
  org_name: string;
  city: string;
  participants: string;
  age_group: string;
  /** ISO "YYYY-MM-DD" */
  date_from: string;
  /** ISO "YYYY-MM-DD" — same as date_from for a single day */
  date_to: string;
  note: string;
  name: string;
  email: string;
  phone: string;
  handled: boolean;
  created_at: string;
}

const COLS =
  "id, inviter_kind, subtype, org_name, city, participants, age_group, date_from, date_to, note, name, email, phone, handled, created_at";

export async function listPresentationInquiries(): Promise<PresentationInquiryRow[]> {
  const { data, error } = await getSupabase()
    .from("presentation_inquiries")
    .select(COLS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function setPresentationInquiryHandled(id: string, handled: boolean): Promise<void> {
  const { error } = await getSupabase()
    .from("presentation_inquiries")
    .update({ handled })
    .eq("id", id);
  if (error) throw error;
}

export async function deletePresentationInquiry(id: string): Promise<void> {
  const { error } = await getSupabase().from("presentation_inquiries").delete().eq("id", id);
  if (error) throw error;
}
