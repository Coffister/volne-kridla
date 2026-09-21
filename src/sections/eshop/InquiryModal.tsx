import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import type { Product } from "@/content";
import { submitProductInquiry } from "@/lib/inquiries";
import Button from "@/ui/components/Button";
import CloseIcon from "@/ui/icons/CloseIcon";
import { Stack, Text } from "@/ui/primitives";
import styles from "./InquiryModal.module.css";

interface InquiryModalProps {
  product: Product;
  /** variants the visitor picked on the detail page, e.g. { Farba: "Red" } */
  variants?: Record<string, string>;
  onClose: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InquiryModal({ product, variants = {}, onClose }: InquiryModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Mám záujem o produkt ${product.name}.`);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Escape closes, Tab stays inside the dialog, scroll is locked, and focus
  // goes back to whatever opened the modal.
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current!;
    const focusable = () =>
      dialog.querySelectorAll<HTMLElement>("button:not(:disabled), input, textarea, a[href]");
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
    setErrors(next);
    if (next.name || next.email) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitProductInquiry({
        productId: product.id,
        productName: product.name,
        name,
        email,
        phone,
        message,
        variants,
      });
      setDone(true);
    } catch {
      setSubmitError("Správu sa nepodarilo odoslať. Skús to prosím znova.");
    } finally {
      setSubmitting(false);
    }
  };

  const variantText = Object.entries(variants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" • ");

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
            <Text as="p" variant="body">
              Vašu správu sme prijali. Ozveme sa vám s ďalšími informáciami.
            </Text>
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
                  {variantText && (
                    <Text as="p" variant="caption">
                      {variantText}
                    </Text>
                  )}
                </div>
              </div>

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

              <div className={styles.field}>
                <label htmlFor={`${titleId}-email`}>E-mail *</label>
                <input
                  id={`${titleId}-email`}
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <input
                  id={`${titleId}-phone`}
                  type="tel"
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  maxLength={50}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor={`${titleId}-msg`}>Správa</label>
                <textarea
                  id={`${titleId}-msg`}
                  className={styles.input}
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                />
              </div>

              <Text as="p" variant="caption">
                <Link to="/ochrana-osobnych-udajov" target="_blank" className={styles.link}>
                  Informácie o spracovaní osobných údajov
                </Link>
              </Text>

              {submitError && (
                <p className={styles.submitError} role="alert">
                  {submitError}
                </p>
              )}

              <Button type="submit" variant="primary" disabled={submitting} fullWidth>
                {submitting ? "Odosielam…" : "Odoslať záujem"}
              </Button>
            </Stack>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
