import { getSupabase } from "@/lib/supabase";

/** Pings the "send-inquiry-email" Edge Function, which mails every not-yet-
 * notified inquiry straight from the database — it takes no payload, so it
 * can't be used to mail arbitrary content. Best-effort: the inquiry is already
 * safely in the database by the time this runs, so a failed/slow email must
 * never surface as an error to the visitor — just log it for debugging. */
async function notifyByEmail() {
  try {
    const { error } = await getSupabase().functions.invoke("send-inquiry-email", { body: {} });
    if (error) console.error("send-inquiry-email failed:", error);
  } catch (e) {
    console.error("send-inquiry-email failed:", e);
  }
}

/** Public — anyone can submit a "mám záujem" inquiry, no auth required
 * (RLS on product_inquiries allows insert-only for anon). */
export async function submitProductInquiry(input: {
  productId: string | null;
  productName: string;
  name: string;
  email: string;
  phone?: string;
  variants?: Record<string, string>;
}): Promise<void> {
  const { error } = await getSupabase().from("product_inquiries").insert({
    product_id: input.productId,
    product_name: input.productName,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || "",
    variants: input.variants ?? {},
  });
  if (error) throw error;

  void notifyByEmail();
}

/** Public — anyone can submit a consultation request from KonzultaciaModal,
 * no auth required (RLS on consultation_inquiries allows insert-only for
 * anon). */
export async function submitConsultationInquiry(input: {
  trackId: string;
  trackLabel: string;
  typeId: string | null;
  typeLabel: string;
  packageId: string | null;
  packageLabel: string;
  packagePrice: string;
  parrotName: string;
  species: string;
  age: string;
  topic: string;
  details: string;
  name: string;
  email: string;
  phone?: string;
  note?: string;
  consent: boolean;
}): Promise<void> {
  const { error } = await getSupabase().from("consultation_inquiries").insert({
    track_label: input.trackLabel,
    type_id: input.typeId ?? "",
    type_label: input.typeLabel,
    package_id: input.packageId ?? "",
    package_label: input.packageLabel,
    package_price: input.packagePrice,
    parrot_name: input.parrotName,
    species: input.species,
    age: input.age,
    topic: input.topic,
    details: input.details,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || "",
    note: input.note?.trim() || "",
    consent: input.consent,
  });
  if (error) throw error;

  void notifyByEmail();
}

/** Public — booking request for a school / organisation presentation from
 * RezervaciaModal, no auth required (RLS on presentation_inquiries allows
 * insert-only for anon). */
export async function submitPresentationInquiry(input: {
  inviterKind: string;
  inviterLabel: string;
  subtype: string;
  orgName: string;
  city: string;
  participants: string;
  ageGroup: string;
  /** ISO "YYYY-MM-DD" */
  dateFrom: string;
  /** ISO "YYYY-MM-DD" — same as dateFrom for a single day */
  dateTo: string;
  /** human-readable range for the notification email */
  dateLabel: string;
  note?: string;
  name: string;
  email: string;
  phone?: string;
  consent: boolean;
}): Promise<void> {
  const row = {
    inviter_kind: input.inviterLabel,
    subtype: input.subtype,
    org_name: input.orgName.trim(),
    city: input.city.trim(),
    participants: input.participants.trim(),
    age_group: input.ageGroup,
    date_from: input.dateFrom,
    date_to: input.dateTo,
    note: input.note?.trim() || "",
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || "",
    consent: input.consent,
  };

  const { error } = await getSupabase().from("presentation_inquiries").insert(row);
  if (error) throw error;

  void notifyByEmail();
}
