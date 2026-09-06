import { getSupabase } from "@/lib/supabase";

export type FaqGroup = "tipy" | "otazky";

export interface FaqRow {
  id: string;
  group_key: FaqGroup;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

const COLS = "id, group_key, question, answer, sort_order, published, created_at";

export async function listFaqItems(group: FaqGroup): Promise<FaqRow[]> {
  const { data, error } = await getSupabase()
    .from("faq_items")
    .select(COLS)
    .eq("group_key", group)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createFaqItem(input: {
  group: FaqGroup;
  question: string;
  answer: string;
}): Promise<FaqRow> {
  const supabase = getSupabase();

  const { data: last } = await supabase
    .from("faq_items")
    .select("sort_order")
    .eq("group_key", input.group)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (last?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("faq_items")
    .insert({
      group_key: input.group,
      question: input.question.trim(),
      answer: input.answer.trim(),
      sort_order,
    })
    .select(COLS)
    .single();

  if (error) throw error;
  return data;
}

export async function updateFaqItem(
  id: string,
  patch: Partial<Pick<FaqRow, "question" | "answer" | "published" | "sort_order">>,
): Promise<void> {
  const { error } = await getSupabase()
    .from("faq_items")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteFaqItem(id: string): Promise<void> {
  const { error } = await getSupabase().from("faq_items").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderFaqItems(items: FaqRow[]): Promise<void> {
  const supabase = getSupabase();
  await Promise.all(
    items.map((it, i) =>
      it.sort_order === i
        ? Promise.resolve()
        : supabase.from("faq_items").update({ sort_order: i }).eq("id", it.id),
    ),
  );
}
