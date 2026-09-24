import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import type { Product } from "@/content";
import { submitProductInquiry } from "@/lib/inquiries";
import Button from "@/ui/components/Button";
import CloseIcon from "@/ui/icons/CloseIcon";
import ChevronDownIcon from "@/ui/icons/ChevronDownIcon";
import { Stack, Text } from "@/ui/primitives";
import VariantPicker from "./VariantPicker";
import czFlag from "@/assets/icons/flags/cz.svg";
import skFlag from "@/assets/icons/flags/sk.svg";
import styles from "./InquiryModal.module.css";

interface InquiryModalProps {
  product: Product;
  /** variants the visitor picked on the detail page, e.g. { Farba: "Red" } */
  variants?: Record<string, string>;
  onClose: () => void;
}

// same shape as the CHECK in supabase/migrations/0010 (no ? & etc. — the admin
// opens it as a mailto: link)
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_PATTERN = /^[0-9()\s-]{6,40}$/;

const FLAGS = { "+421": skFlag, "+420": czFlag };
type Code = keyof typeof FLAGS;

export default function InquiryModal({ product, variants: initialVariants = {}, onClose }: InquiryModalProps) {
  const [variants, setVariants] = useState(initialVariants);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState<Code>("+421");
  const [codeOpen, setCodeOpen] = useState(false);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; variants?: string; consent?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Escape closes, Tab stays inside the dialog, scroll is locked, and focus
  // goes back to whatever opened the modal.
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current!;
    const focusable = () =>
      dialog.querySelectorAll<HTMLElement>("button:not(:disabled), input, select, a[href]");
    focusable()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const els = focusable();
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Zadaj svoje meno.";
    if (!EMAIL_PATTERN.test(email.trim())) next.email = "Zadaj platný e-mail.";
    if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) next.phone = "Zadaj telefón bez predvoľby, len číslice a medzery.";
    const missing = (product.variants ?? []).find((v) => !variants[v.label]);
    if (missing) next.variants = `Vyber možnosť: ${missing.label}.`;
    if (!consent) next.consent = "Pre odoslanie je potrebný súhlas so spracovaním údajov.";
    setErrors(next);
    if (Object.keys(next).length) return;

    // honeypot: real visitors never see this field; bots that fill it get a fake success
    if (new FormData(e.currentTarget as HTMLFormElement).get("website")) return setDone(true);

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitProductInquiry({
        productId: product.id,
        productName: product.name,
        name,
        email,
        phone: phone.trim() && `${code} ${phone.trim()}`,
        message: `Mám záujem o produkt ${product.name}.`,
        variants,
      });
      setDone(true);
    } catch {
      setSubmitError("Správu sa nepodarilo odoslať. Skús to prosím znova.");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Zavrieť">
          <CloseIcon />
        </button>

        {done ? (
          <Stack direction="column" align="center" gap="sm" className={styles.success}>
            <div id={titleId}>
              <Text as="h2" variant="cardTitle">
                Ďakujeme za váš záujem.
              </Text>
            </div>
            <div role="status">
              <Text as="p" variant="body">
                Vašu správu sme prijali. Ozveme sa vám s ďalšími informáciami.
              </Text>
            </div>
            <Button variant="primary" onClick={onClose}>
              Zavrieť
            </Button>
          </Stack>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Stack direction="column" gap="sm">
              <div id={titleId}>
                <Text as="h2" variant="cardTitle">
                  Mám záujem o tento produkt
                </Text>
              </div>

              <div className={styles.product}>
                {product.image && <img src={product.image} alt="" className={styles.thumb} />}
                <div>
                  <Text as="p" variant="body" weight="bold">
                    {product.name}
                  </Text>
                </div>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div>
                  <VariantPicker
                    columns
                    variants={product.variants}
                    value={variants}
                    onChange={(label, option) => setVariants((v) => ({ ...v, [label]: option }))}
                  />
                  {errors.variants && (
                    <p className={styles.fieldError} role="alert">
                      {errors.variants}
                    </p>
                  )}
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor={`${titleId}-name`}>Meno *</label>
                <input
                  id={`${titleId}-name`}
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  maxLength={200}
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${titleId}-name-err` : undefined}
                />
                {errors.name && (
                  <p id={`${titleId}-name-err`} className={styles.fieldError} role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor={`${titleId}-email`}>E-mail *</label>
                  <input
                    id={`${titleId}-email`}
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="váš@email.com"
                    autoComplete="email"
                    maxLength={320}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? `${titleId}-email-err` : undefined}
                  />
                  {errors.email && (
                    <p id={`${titleId}-email-err`} className={styles.fieldError} role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor={`${titleId}-phone`}>Telefón</label>
                  <div className={`${styles.input} ${styles.phone}`} aria-invalid={!!errors.phone}>
                    <div
                      className={`${styles.code} ${codeOpen ? styles.codeOpen : ""}`}
                      onBlur={(e) => e.currentTarget.contains(e.relatedTarget) || setCodeOpen(false)}
                    >
                      <button
                        type="button"
                        className={styles.codeBtn}
                        onClick={() => setCodeOpen((o) => !o)}
                        aria-haspopup="listbox"
                        aria-expanded={codeOpen}
                        aria-label="Predvoľba"
                      >
                        <img src={FLAGS[code]} alt="" className={styles.flag} />
                        {code}
                        <span className={styles.chevron}>
                          <ChevronDownIcon />
                        </span>
                      </button>
                      {codeOpen && (
                        <div role="listbox" className={styles.codeMenu}>
                          {(Object.keys(FLAGS) as Code[]).map((c) => (
                            <button
                              key={c}
                              type="button"
                              role="option"
                              aria-selected={c === code}
                              className={styles.codeOption}
                              onClick={() => {
                                setCode(c);
                                setCodeOpen(false);
                              }}
                            >
                              <img src={FLAGS[c]} alt="" className={styles.flag} />
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      id={`${titleId}-phone`}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9xx xxx xxx"
                      autoComplete="tel-national"
                      maxLength={40}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? `${titleId}-phone-err` : undefined}
                    />
                  </div>
                  {errors.phone && (
                    <p id={`${titleId}-phone-err`} className={styles.fieldError} role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <input
                name="website"
                className={styles.honeypot}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div>
                <label className={styles.consent}>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-required="true"
                    aria-invalid={!!errors.consent}
                  />
                  <Link to="/ochrana-osobnych-udajov" target="_blank" className={styles.link}>
                    Informácie o spracovaní osobných údajov
                  </Link>
                </label>
                {errors.consent && (
                  <p className={styles.fieldError} role="alert">
                    {errors.consent}
                  </p>
                )}
              </div>

              {submitError && (
                <p className={styles.submitError} role="alert">
                  {submitError}
                </p>
              )}

              <div className={styles.submit}>
                <Button type="submit" variant="primary" disabled={submitting} fullWidth>
                  {submitting ? "Odosielam…" : "Odoslať záujem"}
                </Button>
              </div>
            </Stack>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
