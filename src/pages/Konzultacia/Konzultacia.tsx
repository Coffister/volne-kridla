import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import Text from "@/ui/primitives/Text";

import { CONSULT_PACKAGES, CONSULT_TYPES } from "./data";
import styles from "./Konzultacia.module.css";

type Step = 1 | 2 | 3 | 4;

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
};

const STEP_LABELS = ["Typ", "Balík", "Údaje"];

export default function Konzultacia() {
  const [step, setStep] = useState<Step>(1);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [packageId, setPackageId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    // move focus for screen readers without yanking the viewport under the
    // floating navbar
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const selectedType = CONSULT_TYPES.find((t) => t.id === typeId);
  const selectedPackage = CONSULT_PACKAGES.find((p) => p.id === packageId);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Uveďte prosím svoje meno.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Uveďte platný e-mail.";
    if (!form.message.trim())
      next.message = "Napíšte pár viet o svojom papagájovi.";
    if (!form.consent) next.consent = "Bez súhlasu vás nemôžem kontaktovať.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Ukážka: dopyt sa zatiaľ neodosiela nikam, iba sa vypíše do konzoly.
    console.log("dopyt", {
      typ: selectedType?.title,
      balík: selectedPackage?.title,
      ...form,
    });
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setStep(4);
  }

  function resetAll() {
    setStep(1);
    setTypeId(null);
    setPackageId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.banner}>
          Ukážková podstránka — návrh kontaktného toku. Balíky a ceny sú príklady.
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
            <Text
              as="h1"
              variant="cardTitle"
              className={styles.heading}
            >
              <span ref={headingRef} tabIndex={-1}>
                Aký typ konzultácie hľadáte?
              </span>
            </Text>
            <div className={styles.options} role="radiogroup" aria-label="Typ konzultácie">
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
            <Text as="h1" variant="cardTitle" className={styles.heading}>
              <span ref={headingRef} tabIndex={-1}>
                Vyberte si balík
              </span>
            </Text>
            <div
              className={styles.options}
              role="radiogroup"
              aria-label="Balík konzultácie"
            >
              {CONSULT_PACKAGES.map((p) => (
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
                  {p.badge && <span className={styles.optionBadge}>{p.badge}</span>}
                  <span className={styles.optionTitle}>{p.title}</span>
                  <span className={styles.optionPrice}>{p.price}</span>
                  <ul className={styles.optionPoints}>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
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
            <Text as="h1" variant="cardTitle" className={styles.heading}>
              <span ref={headingRef} tabIndex={-1}>
                Vaše údaje
              </span>
            </Text>

            <div className={styles.recap}>
              <span>
                {selectedType?.title} · {selectedPackage?.title}
              </span>
              <button
                type="button"
                className={styles.recapEdit}
                onClick={() => setStep(1)}
              >
                Zmeniť
              </button>
            </div>

            <div className={styles.field}>
              <label htmlFor="k-name">Meno a priezvisko</label>
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
                {errors.email && <p className={styles.error}>{errors.email}</p>}
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

            <div className={styles.field}>
              <label htmlFor="k-message">Správa</label>
              <textarea
                id="k-message"
                rows={5}
                placeholder="Napíšte mi o svojom papagájovi — aký druh, koľko má rokov a čo chcete riešiť."
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p className={styles.error}>{errors.message}</p>
              )}
            </div>

            <label className={styles.consent}>
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
                aria-invalid={!!errors.consent}
              />
              <span>
                Súhlasím so spracovaním údajov za účelom odpovede na tento dopyt.
              </span>
            </label>
            {errors.consent && <p className={styles.error}>{errors.consent}</p>}

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
              <a href="https://instagram.com/volne.kridla" target="_blank" rel="noreferrer">
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
            <Text as="h1" variant="cardTitle" className={styles.heading}>
              <span ref={headingRef} tabIndex={-1}>
                Mám to{form.name ? `, ${form.name.split(" ")[0]}` : ""}.
              </span>
            </Text>
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
    </div>
  );
}
