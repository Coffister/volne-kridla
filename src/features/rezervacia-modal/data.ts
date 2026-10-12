// Obsah rezervačného modalu pre prezentácie (školy a organizácie).

export const INVITER_KINDS = [
  { id: "skola", label: "Škola" },
  { id: "organizacia", label: "Organizácia" },
] as const;
export type InviterKind = (typeof INVITER_KINDS)[number]["id"];

export const SCHOOL_TYPES = [
  "Materská škola",
  "Základná škola",
  "Stredná škola",
  "Školský klub",
  "Iná škola",
];

export const ORGANIZATION_TYPES = [
  "Centrum voľného času",
  "Domov seniorov",
  "Komunitné centrum",
  "Tábor",
  "Záujmová skupina",
  "Chovateľské podujatie",
  "Iná organizácia",
];

export const AGE_GROUPS = [
  "Deti 3–6 rokov",
  "Deti 6–10 rokov",
  "Deti 10–15 rokov",
  "Mládež 15–19 rokov",
  "Dospelí",
  "Seniori",
  "Zmiešaná skupina",
];

/* ---- GDPR ------------------------------------------------------------ */

export const CONSENT_PREFIX = "Súhlasím so ";
export const CONSENT_LINK_TEXT = "spracovaním osobných údajov";
export const CONSENT_SUFFIX = " za účelom dohodnutia a realizácie prezentácie.";

export const GDPR_TEXT =
  "Odoslaním formulára beriete na vedomie, že poskytnuté osobné údaje (meno kontaktnej osoby, kontaktné údaje a informácie o vašej organizácii) budú spracované výlučne za účelom kontaktovania, prípravy a realizácie prezentácie. Údaje nie sú poskytované tretím stranám a sú uchovávané len po dobu nevyhnutnú na realizáciu prezentácie a následnej komunikácie. Máte právo na prístup k svojim údajom, ich úpravu alebo vymazanie.";
