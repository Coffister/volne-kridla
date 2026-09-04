import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";

import Squircle from "@/ui/primitives/Squircle";

import {
  CONSENT_LABEL,
  CONSULT_TYPES,
  GDPR_TEXT,
  PACKAGES,
  PARROT_SPECIES,
  PARROT_TOPICS,
  TRACKS,
  type TrackId,
} from "./data";
import { useKonzultaciaModal } from "./useKonzultaciaModal";
import {
  FeatherIcon,
  ChatIcon,
  PackageIcon,
  ClipboardIcon,
  IdCardIcon,
  CheckCircleIcon,
  CheckIcon,
} from "./icons";
import styles from "./KonzultaciaModal.module.css";

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

// keep in sync with the exit animation duration in KonzultaciaModal.module.css
const CLOSE_ANIMATION_MS = 200;

// same icon as that step's own section heading, so the stepper previews
// what's coming next
const STEP_ICONS = [FeatherIcon, ClipboardIcon, IdCardIcon, CheckCircleIcon];

function Stepper({ step }: { step: Step }) {
  return (
    <ol className={styles.stepper} aria-hidden>
      {[1, 2, 3, 4].map((n) => {
        const state = n < step ? "done" : n === step ? "current" : "upcoming";
        const StepIcon = STEP_ICONS[n - 1];
        return (
          <li key={n} className={styles.stepItem}>
            <span className={styles.stepDot} data-state={state}>
              {state === "done" ? <CheckIcon size={14} /> : <StepIcon size={16} />}
            </span>
            {n < 4 && (
              <span className={styles.stepLine} data-active={n <= step} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function KonzultaciaModal() {
  const { isOpen, track: requestedTrack, close } = useKonzultaciaModal();

  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const [step, setStep] = useState<Step>(1);
  const [track, setTrack] = useState<TrackId>(requestedTrack);
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

  // fresh form every time the modal opens; the track comes from whatever the
  // trigger (or shared link) requested at that moment
  useEffect(() => {
    if (!isOpen) return;
    const initialPackages = PACKAGES[requestedTrack];
    setStep(1);
    setTrack(requestedTrack);
    setTypeId(null);
    setPackageId(initialPackages.length === 1 ? initialPackages[0].id : null);
    setForm(EMPTY_FORM);
    setErrors({});
    setGdprOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const requestClose = () => {
    if (closeTimer.current) return;
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = undefined;
      setIsClosing(false);
      close();
    }, CLOSE_ANIMATION_MS);
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

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
    const nextPackages = PACKAGES[next];
    setPackageId(nextPackages.length === 1 ? nextPackages[0].id : null);
  }

  function validateStep2(): boolean {
    const next: typeof errors = {};
    if (!form.species) next.species = "Vyberte druh papagája.";
    if (!form.topic) next.topic = "Vyberte, čo chcete riešiť.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep3(): boolean {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Uveďte prosím svoje meno.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Uveďte platný e-mail.";
    if (!form.consent) next.consent = "Bez súhlasu vás nemôžem kontaktovať.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep3()) return;
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

  return createPortal(
    <div
      className={`${styles.overlay} ${isClosing ? styles.closing : ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <Squircle
        radius="2xl"
        borderWidth={4}
        borderColor="var(--color-border-primary)"
        className={styles.cardShell}
      >
      <div className={styles.card} role="dialog" aria-modal="true">
        {step < 4 && <Stepper step={step} />}

        {step === 1 && (
          <section key="step-1" className={styles.stepPane}>
            <h1 className={styles.heading}>
              <FeatherIcon />
              <span ref={headingRef} tabIndex={-1}>
                Pre svojho papagája hľadám
              </span>
            </h1>

            <div className={styles.pillRow} role="tablist" aria-label="Typ služby">
              {TRACKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={track === t.id}
                  className={styles.pill}
                  data-active={track === t.id}
                  onClick={() => changeTrack(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {track === "konzultacia" && (
              <>
                <h2 className={styles.subheading}>
                  <ChatIcon />
                  Mám záujem o
                </h2>
                <div
                  className={styles.pillRow}
                  role="radiogroup"
                  aria-label="Spôsob konzultácie"
                >
                  {CONSULT_TYPES.map((t) => (
                    <label
                      key={t.id}
                      className={styles.pillLabel}
                      data-active={typeId === t.id}
                    >
                      <input
                        className={styles.srOnly}
                        type="radio"
                        name="type"
                        value={t.id}
                        checked={typeId === t.id}
                        onChange={() => setTypeId(t.id)}
                      />
                      {t.title}
                    </label>
                  ))}
                </div>
              </>
            )}

            <h2 className={styles.subheading}>
              <PackageIcon />
              Vyberám si balíček
            </h2>
            <div
              className={styles.packages}
              role="radiogroup"
              aria-label="Balík"
            >
              {packages.map((p) => (
                <label
                  key={p.id}
                  className={styles.packageCard}
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
                    <span className={styles.packageBadge}>{p.badge}</span>
                  )}
                  <span className={styles.packageTitle}>{p.title}</span>
                  {p.subtitle && (
                    <span className={styles.packageSubtitle}>{p.subtitle}</span>
                  )}
                  <span className={styles.packagePrice}>{p.price}</span>
                  <ul className={styles.packagePoints}>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </label>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section key="step-2" className={styles.stepPane}>
            <h1 className={styles.heading}>
              <ClipboardIcon />
              <span ref={headingRef} tabIndex={-1}>
                Údaje o papagájovi
              </span>
            </h1>

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
              {errors.species && <p className={styles.error}>{errors.species}</p>}
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor="k-parrot-name">
                  Meno papagája{" "}
                  <span className={styles.optional}>(nepovinné)</span>
                </label>
                <input
                  id="k-parrot-name"
                  type="text"
                  value={form.parrotName}
                  onChange={(e) => set("parrotName", e.target.value)}
                />
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
                placeholder="Ako dlho papagája máte, čo ste už skúšali…"
                value={form.details}
                onChange={(e) => set("details", e.target.value)}
              />
            </div>
          </section>
        )}

        {step === 3 && (
          <form
            key="step-3"
            id="konzultacia-step3"
            className={styles.stepPane}
            onSubmit={onSubmit}
            noValidate
          >
            <h1 className={styles.heading}>
              <IdCardIcon />
              <span ref={headingRef} tabIndex={-1}>
                Vaše údaje
              </span>
            </h1>

            <div className={styles.recap}>
              <span>
                {[trackLabel, selectedType?.title, selectedPackage?.title]
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
          </form>
        )}

        {step === 4 && (
          <section key="step-4" className={`${styles.success} ${styles.stepPane}`}>
            <h1 className={styles.heading}>
              <CheckCircleIcon />
              <span ref={headingRef} tabIndex={-1}>
                Mám to{form.name ? `, ${form.name.split(" ")[0]}` : ""}.
              </span>
            </h1>
            <p>
              Ozvem sa do 24 hodín na <strong>{form.email}</strong>.
            </p>
          </section>
        )}

        <div className={styles.actions}>
          {step === 1 && (
            <button type="button" className={styles.ghostBtn} onClick={requestClose}>
              Zavrieť
            </button>
          )}
          {(step === 2 || step === 3) && (
            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => setStep((s) => (s - 1) as Step)}
            >
              Späť
            </button>
          )}
          {step === 4 && <span />}

          {step === 1 && (
            <button
              type="button"
              className={styles.primaryBtn}
              disabled={track === "konzultacia" ? !typeId || !packageId : !packageId}
              onClick={() => setStep(2)}
            >
              Pokračovať
            </button>
          )}
          {step === 2 && (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => validateStep2() && setStep(3)}
            >
              Pokračovať
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              form="konzultacia-step3"
              className={styles.primaryBtn}
              disabled={submitting}
            >
              {submitting ? "Odosielam…" : "Odoslať dopyt"}
            </button>
          )}
          {step === 4 && (
            <button type="button" className={styles.primaryBtn} onClick={requestClose}>
              Zavrieť
            </button>
          )}
        </div>
      </div>
      </Squircle>
    </div>,
    document.body,
  );
}
