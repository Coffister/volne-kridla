import { getSupabase } from "@/lib/supabase";

export interface ConsultationInquiryRow {
  id: string;
  track_label: string;
  type_label: string;
  package_label: string;
  parrot_name: string;
  species: string;
  age: string;
  topic: string;
  details: string;
  name: string;
  email: string;
  phone: string;
  note: string;
  consent: boolean;
  handled: boolean;
  created_at: string;
}

const COLS =
  "id, track_label, type_label, package_label, parrot_name, species, age, topic, details, name, email, phone, note, consent, handled, created_at";

export async function listConsultationInquiries(): Promise<ConsultationInquiryRow[]> {
  const { data, error } = await getSupabase()
    .from("consultation_inquiries")
    .select(COLS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function setConsultationInquiryHandled(id: string, handled: boolean): Promise<void> {
  const { error } = await getSupabase()
    .from("consultation_inquiries")
    .update({ handled })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteConsultationInquiry(id: string): Promise<void> {
  const { error } = await getSupabase().from("consultation_inquiries").delete().eq("id", id);
  if (error) throw error;
}
