import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CalendarBlank } from "@phosphor-icons/react";
import { Squircle } from "@/ui/primitives";
import DateRangePicker, { formatShort, toIsoDate, type DateRange } from "@/ui/components/DateRangePicker";
import { submitPresentationInquiry } from "@/lib/inquiries";

import {
  AGE_GROUPS,
  CONSENT_LINK_TEXT,
  CONSENT_PREFIX,
  CONSENT_SUFFIX,
  GDPR_TEXT,
  INVITER_KINDS,
  ORGANIZATION_TYPES,
  SCHOOL_TYPES,
  type InviterKind,
} from "./data";
import { useRezervaciaModal } from "./useRezervaciaModal";
import CityInput from "./CityInput";
// same visual shell as the consultation modal — one look for every booking
// flow on the site
import Confetti from "@/features/konzultacia-modal/Confetti";
import {
  FeatherIcon,
  ChatIcon,
  ClipboardIcon,
  IdCardIcon,
  CheckCircleIcon,
  CheckIcon,
} from "@/features/konzultacia-modal/icons";
import ChevronDownIcon from "@/ui/icons/ChevronDownIcon";
import CloseIcon from "@/ui/icons/CloseIcon";
import skFlag from "@/assets/icons/flags/sk.svg";
import czFlag from "@/assets/icons/flags/cz.svg";
import styles from "@/features/konzultacia-modal/KonzultaciaModal.module.css";

const PHONE_FLAGS = { "+421": skFlag, "+420": czFlag };
type PhoneCode = keyof typeof PHONE_FLAGS;

function formatPhoneDisplay(digits: string): string {
  return digits.match(/.{1,3}/g)?.join(" ") ?? "";
}

type Step = 1 | 2 | 3 | 4;

interface FormState {
  subtype: string;
  orgName: string;
  city: string;
  participants: string;
  ageGroup: string;
  note: string;
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}

type ErrorKey = keyof FormState | "kind" | "dates";

const EMPTY_FORM: FormState = {
  subtype: "",
  orgName: "",
  city: "",
  participants: "",
  ageGroup: "",
  note: "",
  name: "",
  email: "",
  phone: "",
  consent: false,
};

const EMPTY_RANGE: DateRange = { start: null, end: null };

// keep in sync with KonzultaciaModal (shared stylesheet)
const CLOSE_ANIMATION_MS = 200;
const CARD_BORDER_WIDTH = 4;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_CHECK_DELAY_MS = 3000;

const STEP_ICONS = [FeatherIcon, ClipboardIcon, IdCardIcon, CheckCircleIcon];

function Control({ invalid, className = "", children }: { invalid?: boolean; className?: string; children: ReactNode }) {
  return (
    <Squircle radius="sm" borderWidth={2} borderColor="currentColor" className={`${styles.control} ${className}`}>
      <div data-invalid={invalid || undefined} className={styles.controlInner}>
        {children}
      </div>
    </Squircle>
  );
}

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
            {n < 4 && <span className={styles.stepLine} data-active={n <= step} />}
          </li>
        );
      })}
    </ol>
  );
}

function formatRange({ start, end }: DateRange): string {
  if (!start) return "";
  if (!end || start.getTime() === end.getTime()) return formatShort(start);
  return `${formatShort(start)} – ${formatShort(end)}`;
}

// Booking modal for school / organisation presentations. Same step flow and
// look as KonzultaciaModal: 1) who's inviting, 2) participants + preferred
// dates, 3) contact person, 4) success.
export default function RezervaciaModal() {
  const { isOpen, kind: requestedKind, close, setKind } = useRezervaciaModal();

  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const [step, setStep] = useState<Step>(1);
  const [kind, setKindState] = useState<InviterKind | null>(requestedKind);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [dates, setDates] = useState<DateRange>(EMPTY_RANGE);
  const [phoneCode, setPhoneCode] = useState<PhoneCode>("+421");
  const [phoneCodeOpen, setPhoneCodeOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [gdprOpen, setGdprOpen] = useState(false);
  // honeypot: invisible to people, bots that fill every field fill it too
  const [website, setWebsite] = useState("");

  const headingRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  // animated card height — see KonzultaciaModal for why .stepContent is
  // what gets measured
  const stepperHeaderRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);
  useLayoutEffect(() => {
    if (!isOpen && !isClosing) return;
    const content = stepContentRef.current;
    const stepperEl = stepperHeaderRef.current;
    const actionsEl = actionsRef.current;
    if (!content || !stepperEl || !actionsEl) return;

    const update = () => {
      const scrollEl = content.parentElement;
      const scrollPadding = scrollEl
        ? parseFloat(getComputedStyle(scrollEl).paddingTop) +
          parseFloat(getComputedStyle(scrollEl).paddingBottom)
        : 0;
      const height =
        stepperEl.getBoundingClientRect().height +
        content.getBoundingClientRect().height +
        scrollPadding +
        actionsEl.getBoundingClientRect().height;
      setCardHeight(height + CARD_BORDER_WIDTH * 2);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(content);
    observer.observe(stepperEl);
    observer.observe(actionsEl);
    return () => observer.disconnect();
  }, [isOpen, isClosing]);

  // a draft survives an accidental close; it resets on first open, after a
  // finished submission, or when a CTA asks for the other inviter kind
  const hasInitialized = useRef(false);
  const resetOnNextOpen = useRef(false);
  useEffect(() => {
    if (!isOpen) return;
    const isFirstOpen = !hasInitialized.current;
    hasInitialized.current = true;

    const askedForOtherKind = requestedKind !== null && requestedKind !== kind;
    if (!isFirstOpen && !resetOnNextOpen.current && !askedForOtherKind) return;

    resetOnNextOpen.current = false;
    setStep(1);
    setKindState(requestedKind);
    setForm(EMPTY_FORM);
    setDates(EMPTY_RANGE);
    setErrors({});
    setGdprOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const requestClose = () => {
    if (closeTimer.current) return;
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

  const isSchool = kind === "skola";
  const kindLabel = INVITER_KINDS.find((k) => k.id === kind)?.label ?? "";
  const subtypes = isSchool ? SCHOOL_TYPES : ORGANIZATION_TYPES;
  const recapLabel = [form.orgName.trim(), form.city.trim(), formatRange(dates)]
    .filter(Boolean)
    .join(" · ");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function changeKind(next: InviterKind) {
    if (next !== kind) set("subtype", "");
    setKindState(next);
    setKind(next);
    setErrors((e) => ({ ...e, kind: undefined }));
  }

  function changeDates(next: DateRange) {
    setDates(next);
    setErrors((e) => ({ ...e, dates: undefined }));
  }

  function validateStep1(): boolean {
    const next: typeof errors = {};
    if (!kind) next.kind = "Vyberte, či ste škola alebo organizácia.";
    if (!form.subtype) next.subtype = isSchool ? "Vyberte typ školy." : "Vyberte typ organizácie.";
    if (!form.orgName.trim())
      next.orgName = isSchool ? "Uveďte názov školy." : "Uveďte názov organizácie.";
    if (!form.city.trim()) next.city = "Uveďte mesto alebo obec.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep2(): boolean {
    const next: typeof errors = {};
    if (!/^\d{1,5}$/.test(form.participants.trim()) || Number(form.participants) < 1)
      next.participants = "Uveďte približný počet účastníkov.";
    if (!form.ageGroup) next.ageGroup = "Vyberte vek účastníkov.";
    if (!dates.start) next.dates = "Vyberte preferovaný termín.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep3(): boolean {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Uveďte meno kontaktnej osoby.";
    if (!EMAIL_PATTERN.test(form.email)) next.email = "Uveďte platný e-mail.";
    if (!form.phone.trim()) next.phone = "Uveďte telefónne číslo.";
    if (!form.consent) next.consent = "Bez súhlasu vás nemôžeme kontaktovať.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep3() || !kind || !dates.start) return;
    // a bot filled the hidden field — pretend it worked, store nothing
    if (website) {
      setStep(4);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitPresentationInquiry({
        inviterKind: kind,
        inviterLabel: kindLabel,
        subtype: form.subtype,
        orgName: form.orgName,
        city: form.city,
        participants: form.participants,
        ageGroup: form.ageGroup,
        dateFrom: toIsoDate(dates.start),
        // a single picked day means "exactly this day"
        dateTo: toIsoDate(dates.end ?? dates.start),
        dateLabel: formatRange(dates),
        note: form.note,
        name: form.name,
        email: form.email,
        phone: form.phone.trim() ? `${phoneCode} ${form.phone.trim()}` : "",
        consent: form.consent,
      });
      setStep(4);
    } catch (err) {
      const tooMany = (err as { code?: string } | null)?.code === "P0429";
      setSubmitError(
        tooMany
          ? "Z tohto e-mailu sme práve dostali viac rezervácií. Skúste to prosím o pár minút, alebo nám napíšte priamo."
          : "Rezerváciu sa nepodarilo odoslať. Skúste to prosím znova.",
      );
    } finally {
      setSubmitting(false);
    }
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
        <button type="button" className={styles.close} onClick={requestClose} aria-label="Zavrieť">
          <CloseIcon />
        </button>
        <div className={styles.cardInner}>
          <div ref={stepperHeaderRef} className={styles.stepperHeader}>
            {step < 4 && <Stepper step={step} />}
          </div>
          <div className={styles.cardScroll}>
            <div ref={stepContentRef}>
              {step === 1 && (
                <section key="step-1" className={styles.stepPane}>
                  <h1 className={styles.heading}>
                    <FeatherIcon />
                    <span ref={headingRef} tabIndex={-1}>
                      Prezentáciu objednáva
                    </span>
                  </h1>

                  <div className={styles.pillRow} role="radiogroup" aria-label="Škola alebo organizácia">
                    {INVITER_KINDS.map((k) => (
                      <label key={k.id} className={styles.pillLabel} data-active={kind === k.id}>
                        <input
                          className={styles.srOnly}
                          type="radio"
                          name="inviter-kind"
                          value={k.id}
                          checked={kind === k.id}
                          onChange={() => changeKind(k.id)}
                        />
                        {k.label}
                      </label>
                    ))}
                  </div>
                  {errors.kind && <p className={styles.error}>{errors.kind}</p>}

                  {kind && (
                    <div key={`reveal-${kind}`} className={styles.reveal}>
                      <h2 className={styles.subheading}>
                        <ChatIcon />
                        {isSchool ? "O vašej škole" : "O vašej organizácii"}
                      </h2>

                      <div className={styles.field}>
                        <label htmlFor="r-subtype">{isSchool ? "Typ školy" : "Typ organizácie"}</label>
                        <select
                          id="r-subtype"
                          className={styles.select}
                          value={form.subtype}
                          onChange={(e) => set("subtype", e.target.value)}
                          aria-invalid={!!errors.subtype}
                        >
                          <option value="">Vyberte…</option>
                          {subtypes.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {errors.subtype && <p className={styles.error}>{errors.subtype}</p>}
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="r-org-name">{isSchool ? "Názov školy" : "Názov organizácie"}</label>
                        <input
                          id="r-org-name"
                          type="text"
                          maxLength={200}
                          autoComplete="organization"
                          placeholder={isSchool ? "napr. ZŠ Hviezdoslavova" : "napr. Komunitné centrum Ovocná"}
                          value={form.orgName}
                          onChange={(e) => set("orgName", e.target.value)}
                          aria-invalid={!!errors.orgName}
                        />
                        {errors.orgName && <p className={styles.error}>{errors.orgName}</p>}
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="r-city">Mesto alebo obec</label>
                        <CityInput
                          id="r-city"
                          value={form.city}
                          onChange={(v) => set("city", v)}
                          invalid={!!errors.city}
                        />
                        {errors.city && <p className={styles.error}>{errors.city}</p>}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {step === 2 && (
                <section key="step-2" className={styles.stepPane}>
                  <h1 className={styles.heading}>
                    <ClipboardIcon />
                    <span ref={headingRef} tabIndex={-1}>
                      Účastníci a termín
                    </span>
                  </h1>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label htmlFor="r-participants">Približný počet účastníkov</label>
                      <input
                        id="r-participants"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={99999}
                        step={1}
                        value={form.participants}
                        onChange={(e) => set("participants", e.target.value)}
                        aria-invalid={!!errors.participants}
                      />
                      {errors.participants && <p className={styles.error}>{errors.participants}</p>}
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="r-age">Vek účastníkov</label>
                      <select
                        id="r-age"
                        className={styles.select}
                        value={form.ageGroup}
                        onChange={(e) => set("ageGroup", e.target.value)}
                        aria-invalid={!!errors.ageGroup}
                      >
                        <option value="">Vyberte…</option>
                        {AGE_GROUPS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                      {errors.ageGroup && <p className={styles.error}>{errors.ageGroup}</p>}
                    </div>
                  </div>

                  <h2 className={styles.subheading}>
                    <CalendarBlank size={22} />
                    Preferovaný termín
                  </h2>
                  <DateRangePicker
                    value={dates}
                    onChange={changeDates}
                    startLabel="Najskôr od"
                    endLabel="Najneskôr do"
                    invalid={!!errors.dates}
                  />
                  {errors.dates && <p className={styles.error}>{errors.dates}</p>}

                  <div className={styles.field} style={{ marginTop: "0.9rem" }}>
                    <label htmlFor="r-note">Poznámka (nepovinné)</label>
                    <textarea
                      id="r-note"
                      maxLength={2000}
                      rows={3}
                      placeholder="Preferovaný čas, dĺžka programu, priestory, ďalšie želania…"
                      value={form.note}
                      onChange={(e) => set("note", e.target.value)}
                    />
                  </div>
                </section>
              )}

              {step === 3 && (
                <form
                  key="step-3"
                  id="rezervacia-step3"
                  className={styles.stepPane}
                  onSubmit={onSubmit}
                  noValidate
                >
                  <h1 className={styles.heading}>
                    <IdCardIcon />
                    <span ref={headingRef} tabIndex={-1}>
                      Kontaktná osoba
                    </span>
                  </h1>

                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }}
                  />

                  <div className={styles.recap}>
                    <span>{recapLabel}</span>
                    <button type="button" className={styles.recapEdit} onClick={() => setStep(1)}>
                      Zmeniť
                    </button>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="r-name">Meno a priezvisko</label>
                    <input
                      id="r-name"
                      type="text"
                      maxLength={200}
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <p className={styles.error}>{errors.name}</p>}
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label htmlFor="r-email">E-mail</label>
                      <input
                        id="r-email"
                        type="email"
                        maxLength={320}
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <p className={styles.error}>{errors.email}</p>}
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="r-phone">Telefón</label>
                      <div
                        className={styles.phoneWrap}
                        onBlur={(e) =>
                          e.currentTarget.contains(e.relatedTarget as Node) || setPhoneCodeOpen(false)
                        }
                      >
                        <Control invalid={!!errors.phone} className={styles.phone}>
                          <button
                            type="button"
                            className={`${styles.codeBtn} ${phoneCodeOpen ? styles.codeOpen : ""}`}
                            onClick={() => setPhoneCodeOpen((o) => !o)}
                            aria-haspopup="listbox"
                            aria-expanded={phoneCodeOpen}
                            aria-label="Predvoľba"
                          >
                            <img src={PHONE_FLAGS[phoneCode]} alt="" className={styles.flag} />
                            {phoneCode}
                            <span className={styles.chevron}>
                              <ChevronDownIcon />
                            </span>
                          </button>
                          <input
                            id="r-phone"
                            type="tel"
                            className={styles.bare}
                            autoComplete="tel-national"
                            value={formatPhoneDisplay(form.phone)}
                            onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 9))}
                            onFocus={() => setPhoneCodeOpen(false)}
                            placeholder="9xx xxx xxx"
                            aria-invalid={!!errors.phone}
                          />
                        </Control>
                        {phoneCodeOpen && (
                          <div role="listbox" className={styles.codeMenu}>
                            {(Object.keys(PHONE_FLAGS) as PhoneCode[]).map((c) => (
                              <button
                                key={c}
                                type="button"
                                role="option"
                                aria-selected={c === phoneCode}
                                className={styles.codeOption}
                                onClick={() => {
                                  setPhoneCode(c);
                                  setPhoneCodeOpen(false);
                                }}
                              >
                                <img src={PHONE_FLAGS[c]} alt="" className={styles.flag} />
                                {c}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
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
                  {submitError && <p className={styles.submitError}>{submitError}</p>}
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
                      Ďakujeme{form.name ? `, ${form.name.trim().split(" ")[0]}` : ""}!
                    </span>
                  </h1>
                  <p className={styles.successMeta}>{recapLabel}</p>
                  <p className={styles.successText}>
                    Ozveme sa vám s návrhom programu na <strong>{form.email}</strong>.
                  </p>
                </section>
              )}
            </div>
          </div>

          <div
            ref={actionsRef}
            className={styles.actions}
            data-centered={step === 4 ? "true" : undefined}
            data-align={step === 1 ? "end" : undefined}
          >
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
                disabled={!kind}
                onClick={() => validateStep1() && setStep(2)}
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
                form="rezervacia-step3"
                className={styles.primaryBtn}
                disabled={submitting}
              >
                {submitting ? "Odosielam…" : "Odoslať rezerváciu"}
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
