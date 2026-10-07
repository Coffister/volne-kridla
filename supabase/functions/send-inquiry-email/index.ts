// Supabase Edge Function — sends email notifications via Resend whenever a
// visitor submits either "Mám záujem" (product) or the consultation modal's
// form. Called client-side, right after the row is already safely inserted
// (see src/lib/inquiries.ts) — this is a best-effort notification, not the
// source of truth (the database row is).
//
// For a consultation submission this sends up to 3 emails:
//   1. internal notification to NOTIFY_EMAIL (site owner) — immediate
//   2. branded summary to the visitor — immediate
//   3. branded "next steps" to the visitor — scheduled a few minutes later
//      via Resend's `scheduled_at`, so it doesn't land in the same instant
//      as the summary. Only sent for track "konzultacia" with a known
//      type/package combo — "kurz" (flight course) has no such content.
//
// Required secrets (set with `supabase secrets set NAME=value`):
//   RESEND_API_KEY  — from resend.com → API Keys
//   NOTIFY_EMAIL    — where the internal notification is sent (change any
//                      time without redeploying)
// Optional:
//   FROM_EMAIL      — verified sender, defaults to info@volnekridla.sk
//                      (must be on a domain verified in Resend)

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Voľné krídla <info@volnekridla.sk>";

// delay between the visitor's "summary" and "next steps" emails
const NEXT_STEPS_DELAY_MINUTES = 3;

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

/** One label/value row in the internal notification's summary table; skipped when value is empty. */
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
}

type Payload = ProductInquiryPayload | ConsultationInquiryPayload;

function buildInternalNotification(payload: Payload): { subject: string; html: string } {
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

// ---------------------------------------------------------------------------
// Branded visitor-facing emails (summary + next steps), styled after the
// original WordPress plugin's HTML template.
// ---------------------------------------------------------------------------

const BANNER_URL = "https://volnekridla.sk/wp-content/uploads/2026/02/bannervk.webp";

function p(text: string): string {
  return `<p style="margin:0 0 12px 0;font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:1.4;color:#333333;font-weight:400;letter-spacing:-0.2px;">${text}</p>`;
}

function lastP(text: string): string {
  return `<p style="margin:0;font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:1.4;color:#333333;font-weight:400;letter-spacing:-0.2px;">${text}</p>`;
}

function bullets(items: string[]): string {
  return items.map((item) => p(`- ${item}`)).join("\n");
}

function h2(emoji: string, title: string): string {
  return `<h2 style="margin:0 0 12px 0;font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:16px;line-height:1.4;color:#333333;font-weight:700;letter-spacing:-0.2px;">${emoji} ${title}</h2>`;
}

function section(innerHtml: string): string {
  return `<tr><td align="left" style="padding:16px 32px;">${innerHtml}</td></tr>`;
}

function divider(): string {
  return `
    <tr>
      <td align="center" style="padding:0 32px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="90%" style="margin:0 auto;">
          <tr><td style="border-bottom:2px solid #f5e5b3;line-height:0;font-size:0;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>`;
}

function emailShell(fullName: string, bodySections: string): string {
  return `<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Poppins',Arial,Helvetica,sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding:16px;background-color:#ffffef;border:4px solid #333333;border-radius:32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding:0 0 16px 0;">
                    <img src="${BANNER_URL}" alt="Voľné krídla" width="568" style="max-width:100%;width:100%;height:auto;display:block;border-radius:16px;">
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding:16px 32px;">
                    <h1 style="margin:0;font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:32px;line-height:1.4;color:#333333;font-weight:700;letter-spacing:-0.2px;">Ahoj, ${escapeHtml(fullName)}</h1>
                  </td>
                </tr>
                ${bodySections}
                <tr>
                  <td align="left" style="padding:16px 32px;">
                    <p style="margin:0 0 12px 0;font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:20px;line-height:1.4;color:#333333;font-weight:700;letter-spacing:-0.2px;">Za Voľné krídla, Franka</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function closingSection(): string {
  return section(
    p("⚠️ Prosím, pre istotu si sleduj aj priečinok <strong style=\"font-weight:600;\">Spam / Reklama</strong>.") +
      p("Ďakujem za dôveru a teším sa na spoluprácu.") +
      lastP("Každá konzultácia je individuálna a tieto informácie mi pomôžu pripraviť sa čo najlepšie."),
  );
}

function buildSummaryEmail(payload: ConsultationInquiryPayload): { subject: string; html: string } {
  const packageTitle = payload.typeLabel || payload.trackLabel;
  const packageName = payload.packagePrice
    ? `${payload.packageLabel} (${payload.packagePrice})`
    : payload.packageLabel;

  const summaryRows = [
    p(`Vybraný typ konzultácie: ${escapeHtml(packageTitle)}`),
    lastP(`Zvolený balík: ${escapeHtml(packageName)}`),
    p("👤 Kontaktné údaje"),
    p(`- Meno: ${escapeHtml(payload.name)}`),
    p(`- E-mail: ${escapeHtml(payload.email)}`),
    lastP(`- Telefón: ${escapeHtml(payload.phone)}`),
    p("🦜 Informácie o papagájovi"),
    p(`- Meno papagája: ${escapeHtml(payload.parrotName)}`),
    p(`- Druh papagája: ${escapeHtml(payload.species)}`),
    p(`- Vek papagája (roky): ${escapeHtml(payload.age)}`),
    lastP(`- Aktuálny problém / téma: ${escapeHtml(payload.topic)}`),
    p("📎 Doplnkové informácie"),
    lastP(`- Doplňujúce informácie: ${escapeHtml(payload.details)}`),
  ].join("\n");

  const bodySections = [
    section(
      p("ďakujem za odoslanie formulára k individuálnej konzultácii. Pre istotu ti nižšie posielam prehľad údajov, ktoré si vyplnil(a), aby si ich mal(a) pokope.") +
        lastP("Ak by si si všimol(a) niečo, čo potrebuje doplniť alebo opraviť, pokojne mi daj vedieť."),
    ),
    divider(),
    section(h2("🧾", "Zhrnutie odoslaných údajov") + summaryRows),
    divider(),
    section(
      h2("ℹ️", "Čo bude nasledovať") +
        p("Toto je len potvrdzovací a informačný e-mail.") +
        lastP("V ďalšom kroku ti pošlem samostatný e-mail s ďalšími informáciami a následne ťa budem kontaktovať osobne telefonicky, aby sme si dohodli postup a detaily konzultácie."),
    ),
    divider(),
    closingSection(),
  ].join("\n");

  return {
    subject: "Potvrdenie formulára - Voľné krídla",
    html: emailShell(payload.name, bodySections),
  };
}

// "Ako prebieha konzultácia?" + WhatsApp support content by online/osobná ×
// basic/premium. Basic wording is the site owner's original copy; premium
// is derived from the package point lists in src/features/konzultacia-modal/
// data.ts (2x meetings/calls, 2 months support) — keep these in sync if that
// file's PACKAGES content changes.
const NEXT_STEPS_CONTENT: Record<string, { about: string; months: number }> = {
  "online:basic": {
    about:
      p("Konzultácia je vždy individuálna a trvá približne 60 minút.") +
      p("Je zameraná na konkrétneho papagája, konkrétnu situáciu a konkrétneho človeka.") +
      p("Cieľom nie je rýchle riešenie, ale:") +
      bullets(["pochopenie správania", "rešpekt k potrebám papagája", "dlhodobý a udržateľný výsledok"]) +
      lastP("Počas konzultácie si nastavíme konkrétne kroky, ktoré budeš s papagájom realizovať v praxi."),
    months: 1,
  },
  "online:premium": {
    about:
      p("Konzultácia prebieha formou 2 video hovorov (každý približne 60 minút) a je zameraná na konkrétneho papagája, konkrétnu situáciu a konkrétneho človeka.") +
      p("Cieľom nie je rýchle riešenie, ale:") +
      bullets(["pochopenie správania", "rešpekt k potrebám papagája", "dlhodobý a udržateľný výsledok"]) +
      lastP("Medzi hovormi sledujem tvoj pokrok podľa zaslaných videí, priebežne upravujem tréning podľa reakcií papagája a venujem sa detailnejšiemu vedeniu pri práci s papagájom."),
    months: 2,
  },
  "osobna:basic": {
    about:
      p("Konzultácia je vždy individuálna a trvá približne 60 minút.") +
      p("Je zameraná na konkrétneho papagája, konkrétnu situáciu a konkrétneho človeka.") +
      p("Počas stretnutia:") +
      bullets([
        "osobne pozorujem papagája",
        "pracujeme priamo v praxi",
        "vysvetľujem správanie naživo",
        "nastavíme konkrétne odporúčania pre domáci tréning",
      ]) +
      lastP("Konzultácia prebieha formou osobného stretnutia. Počas neho sledujeme správanie papagája, nastavujeme tréning podľa jeho reakcií a venujeme sa vedeniu človeka pri práci s papagájom."),
    months: 1,
  },
  "osobna:premium": {
    about:
      p("Konzultácia prebieha formou 2 osobných stretnutí (každé približne 60 minút) a je zameraná na konkrétneho papagája, konkrétnu situáciu a konkrétneho človeka.") +
      p("Počas stretnutí:") +
      bullets([
        "osobne pozorujem papagája",
        "pracujeme priamo v praxi",
        "vysvetľujem správanie naživo",
        "priebežne sledujem tvoj pokrok a upravujem tréning podľa reakcií papagája",
      ]) +
      lastP("Venujem sa aj detailnejšiemu vedeniu a odporúčaniam pre domáci tréning medzi jednotlivými stretnutiami."),
    months: 2,
  },
};

function buildNextStepsEmail(payload: ConsultationInquiryPayload): { subject: string; html: string } | null {
  const key = `${payload.typeId}:${payload.packageId}`;
  const content = NEXT_STEPS_CONTENT[key];
  if (!content) return null;

  const monthsLabel = content.months === 1 ? "1 mesiac" : `${content.months} mesiace`;

  const bodySections = [
    section(
      p("Ďakujem za vyplnenie vstupného dotazníka.") +
        lastP("Tvoje informácie som prijala a teraz mám lepší obraz o tvojej situácii aj o tvojom papagájovi."),
    ),
    divider(),
    section(
      h2("🦜", "Čo bude nasledovať") +
        p("V najbližších hodinách ťa budem kontaktovať telefonicky, aby sme:") +
        bullets(["si krátko prešli tvoju situáciu", "upresnili detaily konzultácie", "dohodli ďalší postup a termín"]),
    ),
    divider(),
    section(h2("⏱️", "Ako prebieha konzultácia?") + content.about),
    divider(),
    section(
      h2("💬", "WhatsApp podpora") +
        p("Tvoj vybraný balík zahŕňa aj WhatsApp podporu, ktorá slúži ako sprievod a opora počas spolupráce.") +
        p("Podpora je určená na:") +
        bullets([
          "doplňujúce otázky ku konzultácii",
          "spätnú väzbu k tréningu",
          "posielanie videí a pokrokov",
          "krátke usmernenia",
        ]) +
        p("📅 Podpora prebieha v pracovné dni<br>⏱️ Reakčná doba je do 24 hodín<br>🕊️ Nejde o non-stop chat") +
        lastP(`Dĺžka podpory je ${monthsLabel} a po jej uplynutí sa automaticky ukončuje.`),
    ),
    divider(),
    section(
      h2("🤍", "Pre koho sú konzultácie určené") +
        p("Konzultácie sú vhodné pre ľudí, ktorí:") +
        bullets([
          "sú začiatočníci alebo stredne pokročilí",
          "majú problémy s tréningom",
          "nechcú papagája nútiť",
          "chcú budovať vzťah",
          "chcú pochopiť správanie papagája a urobiť zmenu",
        ]) +
        lastP("Nie sú určené pre tých, ktorí hľadajú rýchle zázraky alebo okamžité riešenia bez vlastného zapojenia."),
    ),
    divider(),
    section(
      lastP("Teším sa na náš rozhovor a na spoločnú prácu. Každý papagáj je jedinečný a presne tak k nemu budeme aj pristupovať."),
    ),
  ].join("\n");

  return {
    subject: `${payload.typeLabel || "Konzultácia"} ${payload.packageLabel ? `– ${payload.packageLabel}` : ""} - Voľné krídla`.trim(),
    html: emailShell(payload.name, bodySections),
  };
}

// ---------------------------------------------------------------------------

async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  scheduledAt?: string;
}): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: args.to,
      reply_to: args.replyTo || undefined,
      subject: args.subject,
      html: args.html,
      scheduled_at: args.scheduledAt,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
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

    const sends: Promise<void>[] = [];

    const { subject: internalSubject, html: internalHtml } = buildInternalNotification(payload);
    sends.push(
      sendEmail({
        to: NOTIFY_EMAIL,
        subject: internalSubject,
        html: internalHtml,
        replyTo: payload.email || undefined,
      }),
    );

    if (payload.kind === "consultation" && payload.email) {
      const { subject: summarySubject, html: summaryHtml } = buildSummaryEmail(payload);
      sends.push(sendEmail({ to: payload.email, subject: summarySubject, html: summaryHtml }));

      const nextSteps = buildNextStepsEmail(payload);
      if (nextSteps) {
        const scheduledAt = new Date(Date.now() + NEXT_STEPS_DELAY_MINUTES * 60_000).toISOString();
        sends.push(
          sendEmail({
            to: payload.email,
            subject: nextSteps.subject,
            html: nextSteps.html,
            scheduledAt,
          }),
        );
      }
    }

    const results = await Promise.allSettled(sends);
    const failures = results.filter((r) => r.status === "rejected");
    for (const f of failures) {
      console.error("send-inquiry-email: one send failed:", (f as PromiseRejectedResult).reason);
    }

    if (failures.length === results.length) {
      throw new Error("all sends failed");
    }

    return new Response(JSON.stringify({ ok: true, sent: results.length - failures.length, failed: failures.length }), {
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
