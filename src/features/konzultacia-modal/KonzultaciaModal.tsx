import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";

import {
  CONSENT_PREFIX,
  CONSENT_LINK_TEXT,
  CONSENT_SUFFIX,
  CONSULT_TYPES,
  GDPR_TEXT,
  PACKAGES,
  PARROT_SPECIES,
  PARROT_TOPICS,
  TRACKS,
  type TrackId,
} from "./data";
import { useKonzultaciaModal } from "./useKonzultaciaModal";
import Confetti from "./Confetti";
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

// keep in sync with .card's border width in KonzultaciaModal.module.css —
// .card is border-box, so its own border isn't part of the .cardInner
// measurement below and has to be added back on top of it
const CARD_BORDER_WIDTH = 4;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// how long to wait after the visitor stops typing an email before flagging
// an invalid format, instead of waiting all the way until submit
const EMAIL_CHECK_DELAY_MS = 3000;

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

  // animate the card's height to match its content instead of snapping —
  // measure the natural height of the (unconstrained) inner wrapper and let
  // CSS transition .card's height to it. A ResizeObserver (rather than
  // reacting to just `step`) catches every reason the content can change
  // height — track/type/package selection, validation errors appearing,
  // the GDPR text toggle — not only a step change.
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);
  useLayoutEffect(() => {
    if (!isOpen && !isClosing) return;
    const el = cardInnerRef.current;
    if (!el) return;

    const update = () =>
      setCardHeight(el.getBoundingClientRect().height + CARD_BORDER_WIDTH * 2);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isOpen, isClosing]);

  // Closing by accident (stray backdrop click, Escape) shouldn't cost the
  // visitor their progress — the draft (step + all fields) survives being
  // closed and reopened. It only resets when: this is the very first time
  // the modal is opened, the visitor finished a submission last time
  // (resetOnNextOpen), or they're opening a specifically different track
  // than the one they had a draft going for (e.g. clicking "Kurz voľného
  // lietania" while an old "Konzultácie" draft is sitting untouched).
  const hasInitialized = useRef(false);
  const resetOnNextOpen = useRef(false);
  useEffect(() => {
    if (!isOpen) return;
    const isFirstOpen = !hasInitialized.current;
    hasInitialized.current = true;

    const shouldReset =
      isFirstOpen || resetOnNextOpen.current || requestedTrack !== track;
    if (!shouldReset) return;

    resetOnNextOpen.current = false;
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
    // the flow is done once they've seen the success step — closing from
    // there means the next open should start a fresh inquiry, not resume
    if (step === 4) resetOnNextOpen.current = true;
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

  // check the email format shortly after they stop typing, instead of only
  // at submit — skipped while empty so it doesn't nag before they've typed
  // anything, and cleared immediately (via `set`) on every keystroke so a
  // stale error never lingers while they're actively fixing it
  useEffect(() => {
    if (!isOpen || !form.email) return;
    const timer = window.setTimeout(() => {
      setErrors((e) => ({
        ...e,
        email: EMAIL_PATTERN.test(form.email) ? undefined : "Uveďte platný e-mail.",
      }));
    }, EMAIL_CHECK_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen, form.email]);

  if (!isOpen && !isClosing) return null;

  const packages = PACKAGES[track];
  const selectedType = CONSULT_TYPES.find((t) => t.id === typeId);
  const selectedPackage = packages.find((p) => p.id === packageId);
  const trackLabel = TRACKS.find((t) => t.id === track)?.label;
  // the "kurz" track has a single package whose title repeats the track
  // label — drop it from the recap instead of showing it twice
  const recapLabel = [
    trackLabel,
    selectedType?.title,
    selectedPackage?.title !== trackLabel ? selectedPackage?.title : null,
  ]
    .filter(Boolean)
    .join(" · ");

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
    if (!form.parrotName.trim()) next.parrotName = "Uveďte meno papagája.";
    if (!form.age.trim() || Number(form.age) < 0)
      next.age = "Uveďte vek papagája.";
    if (!form.topic) next.topic = "Vyberte, čo chcete riešiť.";
    if (!form.details.trim())
      next.details = "Doplňte prosím pár slov o situácii.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep3(): boolean {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Uveďte prosím svoje meno.";
    if (!EMAIL_PATTERN.test(form.email)) next.email = "Uveďte platný e-mail.";
    if (!form.phone.trim()) next.phone = "Uveďte telefónne číslo.";
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
      <div
        className={styles.card}
        style={cardHeight !== undefined ? { height: cardHeight } : undefined}
        role="dialog"
        aria-modal="true"
      >
      <div ref={cardInnerRef} className={styles.cardInner}>
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
                <label htmlFor="k-parrot-name">Meno papagája</label>
                <input
                  id="k-parrot-name"
                  type="text"
                  value={form.parrotName}
                  onChange={(e) => set("parrotName", e.target.value)}
                  aria-invalid={!!errors.parrotName}
                />
                {errors.parrotName && (
                  <p className={styles.error}>{errors.parrotName}</p>
                )}
              </div>
              <div className={styles.field}>
                <label htmlFor="k-age">Vek v rokoch</label>
                <input
                  id="k-age"
                  type="number"
                  min={0}
                  value={form.age}
                  onChange={(e) => set("age", e.target.value)}
                  aria-invalid={!!errors.age}
                />
                {errors.age && <p className={styles.error}>{errors.age}</p>}
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
              <label htmlFor="k-details">Doplňujúce informácie</label>
              <textarea
                id="k-details"
                rows={3}
                placeholder="Ako dlho papagája máte, čo ste už skúšali…"
                value={form.details}
                onChange={(e) => set("details", e.target.value)}
                aria-invalid={!!errors.details}
              />
              {errors.details && <p className={styles.error}>{errors.details}</p>}
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
              <span>{recapLabel}</span>
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
                <label htmlFor="k-phone">Telefón</label>
                <input
                  id="k-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className={styles.error}>{errors.phone}</p>}
              </div>
            </div>

            <label className={styles.consent}>
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
                aria-invalid={!!errors.consent}
              />
              <span>
                {CONSENT_PREFIX}
                <button
                  type="button"
                  className={styles.consentLink}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setGdprOpen((o) => !o);
                  }}
                >
                  {CONSENT_LINK_TEXT}
                </button>
                {CONSENT_SUFFIX}
              </span>
            </label>
            {errors.consent && <p className={styles.error}>{errors.consent}</p>}
            {gdprOpen && <p className={styles.gdprText}>{GDPR_TEXT}</p>}
          </form>
        )}

        {step === 4 && (
          <section key="step-4" className={`${styles.success} ${styles.stepPane}`}>
            <Confetti />
            <span className={styles.successBadge} aria-hidden>
              <CheckIcon size={30} />
            </span>
            <h1 className={styles.successHeading}>
              <span ref={headingRef} tabIndex={-1}>
                Mám to{form.name ? `, ${form.name.split(" ")[0]}` : ""}!
              </span>
            </h1>
            <p className={styles.successMeta}>{recapLabel}</p>
            <p className={styles.successText}>
              Ozvem sa do 24 hodín na <strong>{form.email}</strong>.
            </p>
          </section>
        )}

        <div
          className={styles.actions}
          data-centered={step === 4 ? "true" : undefined}
        >
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
      </div>
    </div>,
    document.body,
  );
}
