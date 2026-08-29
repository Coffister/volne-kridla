import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  CONSENT_LABEL,
  CONSULT_TYPES,
  FAQ,
  GDPR_TEXT,
  INTRO_HEADING,
  INTRO_PARAGRAPHS,
  PACKAGES,
  PARROT_SPECIES,
  PARROT_TOPICS,
  TRACKS,
  type TrackId,
} from "./data";
import styles from "./Konzultacia.module.css";

type Step = 1 | 2 | 3 | 4;

interface FormState {
  parrotName: string;
  species: string;
  age: string;
  topic: string;
  details: string;
  name: string;
  email: string;
  phone: string;
  note: string;
  consent: boolean;
}

const EMPTY_FORM: FormState = {
  parrotName: "",
  species: "",
  age: "",
  topic: "",
  details: "",
  name: "",
  email: "",
  phone: "",
  note: "",
  consent: false,
};

const STEP_LABELS = ["Spôsob", "Balík", "Údaje"];

export default function Konzultacia() {
  const [searchParams] = useSearchParams();
  // deep-link the branch from the navbar, e.g. /konzultacia?vetva=kurz
  const requestedTrack = searchParams.get("vetva");
  const initialTrack: TrackId = TRACKS.some((t) => t.id === requestedTrack)
    ? (requestedTrack as TrackId)
    : "konzultacia";

  const [track, setTrack] = useState<TrackId>(initialTrack);
  const [step, setStep] = useState<Step>(1);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [packageId, setPackageId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);
  const [gdprOpen, setGdprOpen] = useState(false);

  const headingRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const packages = PACKAGES[track];
  const selectedType = CONSULT_TYPES.find((t) => t.id === typeId);
  const selectedPackage = packages.find((p) => p.id === packageId);
  const trackLabel = TRACKS.find((t) => t.id === track)?.label;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function changeTrack(next: TrackId) {
    setTrack(next);
    setPackageId(null);
  }

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.species) next.species = "Vyberte druh papagája.";
    if (!form.topic) next.topic = "Vyberte, čo chcete riešiť.";
    if (!form.name.trim()) next.name = "Uveďte prosím svoje meno.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Uveďte platný e-mail.";
    if (!form.consent) next.consent = "Bez súhlasu vás nemôžem kontaktovať.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    console.log("dopyt", {
      vetva: trackLabel,
      spôsob: selectedType?.title,
      balík: selectedPackage?.title,
      ...form,
    });
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setStep(4);
  }

  function resetAll() {
    setStep(1);
    setTrack("konzultacia");
    setTypeId(null);
    setPackageId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setGdprOpen(false);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.banner}>
          Ukážková podstránka — návrh kontaktného toku. Texty označené „[NÁVRH]"
          treba potvrdiť; ceny doplní Franka.
        </p>

        {step < 4 && (
          <ol className={styles.steps} aria-hidden>
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const state =
                n < step ? "done" : n === step ? "current" : "upcoming";
              return (
                <li key={label} className={styles.step} data-state={state}>
                  <span className={styles.stepDot}>{n < step ? "✓" : n}</span>
                  {label}
                </li>
              );
            })}
          </ol>
        )}

        {step === 1 && (
          <section>
            <h1 className={styles.heading}>
              <span ref={headingRef} tabIndex={-1}>
                {INTRO_HEADING}
              </span>
            </h1>
            <p className={styles.lead}>{INTRO_PARAGRAPHS[0]}</p>

            <div className={styles.track} role="tablist" aria-label="Typ služby">
              {TRACKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={track === t.id}
                  className={styles.trackBtn}
                  data-active={track === t.id}
                  onClick={() => changeTrack(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div
              className={styles.options}
              role="radiogroup"
              aria-label="Spôsob konzultácie"
            >
              {CONSULT_TYPES.map((t) => (
                <label
                  key={t.id}
                  className={styles.option}
                  data-selected={typeId === t.id}
                >
                  <input
                    className={styles.srOnly}
                    type="radio"
                    name="type"
                    value={t.id}
                    checked={typeId === t.id}
                    onChange={() => setTypeId(t.id)}
                  />
                  <span className={styles.optionTitle}>{t.title}</span>
                  <span className={styles.optionDesc}>{t.desc}</span>
                </label>
              ))}
            </div>

            <div className={styles.actions}>
              <span />
              <button
                type="button"
                className={styles.primaryBtn}
                disabled={!typeId}
                onClick={() => setStep(2)}
              >
                Pokračovať
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h1 className={styles.heading}>
              <span ref={headingRef} tabIndex={-1}>
                Vyberte balík
              </span>
            </h1>
            <div
              className={styles.options}
              role="radiogroup"
              aria-label="Balík"
            >
              {packages.map((p) => (
                <label
                  key={p.id}
                  className={styles.option}
                  data-selected={packageId === p.id}
                >
                  <input
                    className={styles.srOnly}
                    type="radio"
                    name="package"
                    value={p.id}
                    checked={packageId === p.id}
                    onChange={() => setPackageId(p.id)}
                  />
                  {p.badge && (
                    <span className={styles.optionBadge}>{p.badge}</span>
                  )}
                  <span className={styles.optionTitle}>{p.title}</span>
                  <span className={styles.optionPrice}>{p.price}</span>
                  <ul className={styles.optionPoints}>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  {p.note && <span className={styles.optionNote}>{p.note}</span>}
                </label>
              ))}
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => setStep(1)}
              >
                Späť
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                disabled={!packageId}
                onClick={() => setStep(3)}
              >
                Pokračovať
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <form onSubmit={onSubmit} noValidate>
            <h1 className={styles.heading}>
              <span ref={headingRef} tabIndex={-1}>
                Vaše údaje
              </span>
            </h1>

            <div className={styles.recap}>
              <span>
                {[
                  trackLabel,
                  selectedType?.title,
                  selectedPackage?.title !== trackLabel
                    ? selectedPackage?.title
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
              <button
                type="button"
                className={styles.recapEdit}
                onClick={() => setStep(1)}
              >
                Zmeniť
              </button>
            </div>

            <div className={styles.groups}>
            <fieldset className={styles.group}>
              <legend className={styles.groupLegend}>O papagájovi</legend>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="k-species">Druh</label>
                  <select
                    id="k-species"
                    className={styles.select}
                    value={form.species}
                    onChange={(e) => set("species", e.target.value)}
                    aria-invalid={!!errors.species}
                  >
                    <option value="">Vyberte druh…</option>
                    {PARROT_SPECIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.species && (
                    <p className={styles.error}>{errors.species}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label htmlFor="k-age">
                    Vek v rokoch{" "}
                    <span className={styles.optional}>(nepovinné)</span>
                  </label>
                  <input
                    id="k-age"
                    type="number"
                    min={0}
                    value={form.age}
                    onChange={(e) => set("age", e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="k-topic">Čo chcete riešiť?</label>
                <select
                  id="k-topic"
                  className={styles.select}
                  value={form.topic}
                  onChange={(e) => set("topic", e.target.value)}
                  aria-invalid={!!errors.topic}
                >
                  <option value="">Vyberte…</option>
                  {PARROT_TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.topic && <p className={styles.error}>{errors.topic}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="k-details">
                  Doplňujúce informácie{" "}
                  <span className={styles.optional}>(nepovinné)</span>
                </label>
                <textarea
                  id="k-details"
                  rows={3}
                  placeholder="Meno papagája, ako dlho ho máte, čo ste už skúšali…"
                  value={form.details}
                  onChange={(e) => set("details", e.target.value)}
                />
              </div>
            </fieldset>

            <fieldset className={styles.group}>
              <legend className={styles.groupLegend}>Vaše kontaktné údaje</legend>

              <div className={styles.field}>
                <label htmlFor="k-name">Celé meno</label>
                <input
                  id="k-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className={styles.error}>{errors.name}</p>}
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="k-email">E-mail</label>
                  <input
                    id="k-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className={styles.error}>{errors.email}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label htmlFor="k-phone">
                    Telefón <span className={styles.optional}>(nepovinné)</span>
                  </label>
                  <input
                    id="k-phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </div>
              </div>
            </fieldset>
            </div>

            <label className={styles.consent}>
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
                aria-invalid={!!errors.consent}
              />
              <span>{CONSENT_LABEL}</span>
            </label>
            {errors.consent && <p className={styles.error}>{errors.consent}</p>}
            <button
              type="button"
              className={styles.gdprToggle}
              onClick={() => setGdprOpen((o) => !o)}
            >
              {gdprOpen ? "Skryť" : "Zobraziť"} celý text o spracovaní údajov
            </button>
            {gdprOpen && <p className={styles.gdprText}>{GDPR_TEXT}</p>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => setStep(2)}
              >
                Späť
              </button>
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={submitting}
              >
                {submitting ? "Odosielam…" : "Odoslať dopyt"}
              </button>
            </div>

            <p className={styles.reassure}>
              Ozvem sa do 24 hodín. Dopyt je nezáväzný. Radšej napíšete rovno?{" "}
              <a
                href="https://instagram.com/volne.kridla"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>{" "}
              alebo{" "}
              <a href="https://wa.me/421900000000" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              .
            </p>
          </form>
        )}

        {step === 4 && (
          <section className={styles.success}>
            <h1 className={styles.heading}>
              <span ref={headingRef} tabIndex={-1}>
                Mám to{form.name ? `, ${form.name.split(" ")[0]}` : ""}.
              </span>
            </h1>
            <p>
              Ozvem sa do 24 hodín na <strong>{form.email}</strong>. Zatiaľ sa
              môžete pozrieť na <Link to="/fotogaleria">fotogalériu</Link>.
            </p>
            <button type="button" className={styles.ghostBtn} onClick={resetAll}>
              Odoslať ďalší dopyt
            </button>
          </section>
        )}
      </div>

      {step < 4 && (
        <div className={styles.faq}>
          <h2 className={styles.subhead}>Časté otázky</h2>
          {FAQ.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
