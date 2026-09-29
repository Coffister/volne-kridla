import { getSupabase } from "@/lib/supabase";

/** Fires the "send-inquiry-email" Edge Function so the site owner gets a
 * notification. Best-effort: the inquiry is already safely in the database
 * by the time this runs, so a failed/slow email must never surface as an
 * error to the visitor — just log it for debugging. */
async function notifyByEmail(kind: "product" | "consultation", payload: Record<string, unknown>) {
  try {
    const { error } = await getSupabase().functions.invoke("send-inquiry-email", {
      body: { kind, ...payload },
    });
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
  message?: string;
  variants?: Record<string, string>;
}): Promise<void> {
  const { error } = await getSupabase().from("product_inquiries").insert({
    product_id: input.productId,
    product_name: input.productName,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || "",
    message: input.message?.trim() || "",
    variants: input.variants ?? {},
  });
  if (error) throw error;

  void notifyByEmail("product", {
    productName: input.productName,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || "",
    message: input.message?.trim() || "",
    variants: input.variants ?? {},
  });
}

/** Public — anyone can submit a consultation request from KonzultaciaModal,
 * no auth required (RLS on consultation_inquiries allows insert-only for
 * anon). */
export async function submitConsultationInquiry(input: {
  trackLabel: string;
  typeLabel: string;
  packageLabel: string;
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
    type_label: input.typeLabel,
    package_label: input.packageLabel,
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

  void notifyByEmail("consultation", {
    trackLabel: input.trackLabel,
    typeLabel: input.typeLabel,
    packageLabel: input.packageLabel,
    parrotName: input.parrotName,
    species: input.species,
    age: input.age,
    topic: input.topic,
    details: input.details,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || "",
  });
}
