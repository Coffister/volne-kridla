import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";

import { Squircle, Text, Stack } from "@/ui/primitives";
import Button from "@/ui/components/Button";
import { submitProductInquiry } from "@/lib/inquiries";

import styles from "./OrderModal.module.css";

interface OrderModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

type State = "form" | "submitting" | "done" | "error";

export default function OrderModal({ productId, productName, onClose }: OrderModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<State>("form");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("submitting");
    try {
      await submitProductInquiry({ productId, productName, name, email, phone, message });
      setState("done");
    } catch {
      setState("error");
    }
  }

  return createPortal(
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <Squircle radius="2xl" borderColor="var(--color-border-primary)" borderWidth={4} className={styles.card}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Zavrieť">
          ×
        </button>

        {state === "done" ? (
          <Stack direction="column" gap="md" align="center" className={styles.doneState}>
            <Text as="h2" variant="sectionSubtitle">
              Ďakujeme!
            </Text>
            <Text as="p" variant="body">
              Tvoj záujem o „{productName}" sme zaznamenali. Ozveme sa ti čo najskôr na email.
            </Text>
            <Button variant="primary" onClick={onClose}>
              Zavrieť
            </Button>
          </Stack>
        ) : (
          <form onSubmit={onSubmit} className={styles.form}>
            <Text as="h2" variant="sectionSubtitle">
              Mám záujem: {productName}
            </Text>
            <Text as="p" variant="body" className={styles.hint}>
              Necháš nám kontakt a my sa ti ozveme s detailmi platby a doručenia.
            </Text>

            <div className={styles.field}>
              <label htmlFor="order-name">Meno</label>
              <input
                id="order-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="order-email">Email</label>
              <input
                id="order-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="order-phone">Telefón (nepovinné)</label>
              <input
                id="order-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="order-message">Poznámka (nepovinné)</label>
              <textarea
                id="order-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {state === "error" && (
              <Text as="p" variant="body" className={styles.error}>
                Niečo sa pokazilo, skús to prosím znova o chvíľu.
              </Text>
            )}

            <Button type="submit" variant="primary" fullWidth disabled={state === "submitting"}>
              {state === "submitting" ? "Odosielam…" : "Odoslať"}
            </Button>
          </form>
        )}
      </Squircle>
    </div>,
    document.body,
  );
}
