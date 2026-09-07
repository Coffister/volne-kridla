import { useState } from "react";
import { createPortal } from "react-dom";
import { Text, Stack } from "@/ui/primitives";
import Button from "@/ui/components/Button";
import { useCart } from "@/lib/CartContext";
import { submitProductInquiry } from "@/lib/inquiries";
import styles from "./CheckoutModal.module.css";

interface CheckoutModalProps {
  onClose: () => void;
}

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { items, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      // Submit each item as a separate inquiry with variants
      for (const item of items) {
        await submitProductInquiry({
          productId: item.product.id,
          productName: item.product.name,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: `${message.trim()}\n\nVarianty: ${
            Object.keys(item.variants).length > 0
              ? Object.entries(item.variants)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ")
              : "žádné"
          }\nKusy: ${item.quantity}`,
        });
      }

      setSuccess(true);
      clearCart();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chyba při odesílání");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return createPortal(
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <Text as="h2" variant="sectionTitle">
              Děkujeme!
            </Text>
            <Text as="p" variant="body">
              Vaše objednávka byla přijata. Brzy se vám ozveme.
            </Text>
            <Button variant="primary" onClick={onClose}>
              Zavřít
            </Button>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.content}>
          {/* Cart items */}
          <div className={styles.cartSection}>
            <Text as="h2" variant="sectionTitle" className={styles.heading}>
              Váš košík
            </Text>

            {items.length === 0 ? (
              <Text as="p" variant="body" className={styles.empty}>
                Košík je prázdný
              </Text>
            ) : (
              <div className={styles.cartItems}>
                {items.map((item, i) => (
                  <div key={i} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      {item.product.image && (
                        <img src={item.product.image} alt={item.product.name} />
                      )}
                    </div>
                    <div className={styles.itemDetails}>
                      <Text as="h3" variant="sectionSubtitle" className={styles.itemName}>
                        {item.product.name}
                      </Text>
                      {Object.keys(item.variants).length > 0 && (
                        <Text as="p" variant="body" className={styles.itemVariants}>
                          {Object.entries(item.variants)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" • ")}
                        </Text>
                      )}
                      <Text as="p" variant="body" className={styles.itemPrice}>
                        {item.product.priceLabel} × {item.quantity}ks
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.paymentNote}>
              <Text as="p" variant="body" weight="bold">
                💳 Jak to funguje?
              </Text>
              <Text as="p" variant="body" className={styles.noteText}>
                Odešlete svou objednávku a my vás budeme kontaktovat s detaily o platbě a doručení.
                Platbu si můžete vybrat sami podle vašich potřeb.
              </Text>
            </div>
          </div>

          {/* Form */}
          <div className={styles.formSection}>
            <Text as="h2" variant="sectionTitle" className={styles.heading}>
              Vaše údaje
            </Text>

            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Jméno *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email *</label>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Telefon</label>
                <input
                  type="tel"
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Zpráva</label>
                <textarea
                  className={styles.textarea}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Vaše poznámky k objednávce…"
                />
              </div>

              <Button type="submit" variant="primary" disabled={submitting || items.length === 0}>
                {submitting ? "Odesílám…" : "Odeslat objednávku"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
