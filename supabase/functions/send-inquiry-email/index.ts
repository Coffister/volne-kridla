// Supabase Edge Function — sends an email notification via Resend whenever
// a visitor submits either "Mám záujem" (product) or the consultation
// modal's form. Called client-side, right after the row is already safely
// inserted (see src/lib/inquiries.ts) — this is a best-effort notification,
// not the source of truth (the database row is).
//
// Required secrets (set with `supabase secrets set NAME=value`):
//   RESEND_API_KEY  — from resend.com → API Keys
//   NOTIFY_EMAIL    — where notifications are sent (change any time without
//                      redeploying — e.g. start with your own address while
//                      testing, switch to the client's later)
// Optional:
//   FROM_EMAIL      — verified sender, defaults to info@volnekridla.sk
//                      (must be on a domain verified in Resend)

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Voľné krídla <info@volnekridla.sk>";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** One label/value row in the email's summary table; skipped when value is empty. */
function row(label: string, value: unknown): string {
  const v = String(value ?? "").trim();
  if (!v) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:4px 0;">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`;
}

interface ProductInquiryPayload {
  kind: "product";
  productName: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  variants?: Record<string, string>;
}

interface ConsultationInquiryPayload {
  kind: "consultation";
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
}

type Payload = ProductInquiryPayload | ConsultationInquiryPayload;

function buildEmail(payload: Payload): { subject: string; html: string } {
  if (payload.kind === "product") {
    const variantRows = Object.entries(payload.variants ?? {})
      .map(([k, v]) => row(k, v))
      .join("");
    return {
      subject: `Nový záujem o produkt: ${payload.productName}`,
      html: `
        <h2 style="margin:0 0 12px;">Nový záujem o produkt</h2>
        <table style="border-collapse:collapse;font:14px/1.4 sans-serif;">
          ${row("Produkt", payload.productName)}
          ${row("Meno", payload.name)}
          ${row("E-mail", payload.email)}
          ${row("Telefón", payload.phone)}
          ${variantRows}
          ${row("Správa", payload.message)}
        </table>
      `,
    };
  }

  return {
    subject: `Nový dopyt na konzultáciu od ${payload.name}`,
    html: `
      <h2 style="margin:0 0 12px;">Nový dopyt na konzultáciu</h2>
      <table style="border-collapse:collapse;font:14px/1.4 sans-serif;">
        ${row("Typ", [payload.trackLabel, payload.typeLabel, payload.packageLabel].filter(Boolean).join(" · "))}
        ${row("Meno", payload.name)}
        ${row("E-mail", payload.email)}
        ${row("Telefón", payload.phone)}
        ${row("Papagáj", payload.parrotName)}
        ${row("Druh", payload.species)}
        ${row("Vek", payload.age)}
        ${row("Téma", payload.topic)}
        ${row("Detaily", payload.details)}
      </table>
    `,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (!RESEND_API_KEY || !NOTIFY_EMAIL) {
    console.error("send-inquiry-email: RESEND_API_KEY / NOTIFY_EMAIL not set");
    return new Response(JSON.stringify({ error: "not configured" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const payload = (await req.json()) as Payload;
    if (payload.kind !== "product" && payload.kind !== "consultation") {
      throw new Error(`unknown kind: ${(payload as { kind?: unknown }).kind}`);
    }

    const { subject, html } = buildEmail(payload);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        reply_to: payload.email || undefined,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend ${res.status}: ${body}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-inquiry-email error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
