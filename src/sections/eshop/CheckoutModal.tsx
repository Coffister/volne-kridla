import { useState } from "react";
import { createPortal } from "react-dom";
import { Text } from "@/ui/primitives";
import Button from "@/ui/components/Button";
import { useCart } from "@/lib/CartContext";
import { submitProductInquiry } from "@/lib/inquiries";
import styles from "./CheckoutModal.module.css";

interface CheckoutModalProps {
  onClose: () => void;
}

const VARIANT_LABELS: Record<string, string> = { color: "Farba", size: "Veľkosť" };

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
      // Submit each item as a separate inquiry with its own variants + quantity
      for (const item of items) {
        await submitProductInquiry({
          productId: item.product.id,
          productName: item.product.name,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          variants: item.variants,
          quantity: item.quantity,
        });
      }

      setSuccess(true);
      clearCart();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chyba pri odosielaní");
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
              Ďakujeme!
            </Text>
            <Text as="p" variant="body">
              Tvoja objednávka bola prijatá. Čoskoro sa ti ozveme.
            </Text>
            <Button variant="primary" onClick={onClose}>
              Zavrieť
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
              Tvoj košík
            </Text>

            {items.length === 0 ? (
              <Text as="p" variant="body" className={styles.empty}>
                Košík je prázdny
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
                            .map(([k, v]) => `${VARIANT_LABELS[k] ?? k}: ${v}`)
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
                💳 Ako to funguje?
              </Text>
              <Text as="p" variant="body" className={styles.noteText}>
                Odošleš svoju objednávku a my ťa budeme kontaktovať s detailmi o platbe a doručení.
                Platbu si môžeš vybrať sám podľa svojich potrieb.
              </Text>
            </div>
          </div>

          {/* Form */}
          <div className={styles.formSection}>
            <Text as="h2" variant="sectionTitle" className={styles.heading}>
              Tvoje údaje
            </Text>

            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Meno *</label>
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
                <label className={styles.label}>Správa</label>
                <textarea
                  className={styles.textarea}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Tvoje poznámky k objednávke…"
                />
              </div>

              <Button type="submit" variant="primary" disabled={submitting || items.length === 0}>
                {submitting ? "Odosielam…" : "Odoslať objednávku"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
