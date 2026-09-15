import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Squircle, Stack, Text } from "@/ui/primitives";
import Button from "@/ui/components/Button";
import { useCart } from "@/lib/CartContext";
import { submitProductInquiry } from "@/lib/inquiries";
import styles from "./CheckoutPage.module.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
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
    return (
      <Squircle radius="xl" className={styles.page}>
        <Stack
          direction="column"
          align="center"
          gap="sm"
          className={styles.successState}
        >
          <Text as="h2" variant="sectionTitle">
            Ďakujeme!
          </Text>
          <Text as="p" variant="body">
            Tvoja objednávka bola prijatá. Čoskoro sa ti ozveme.
          </Text>
          <Button variant="primary" onClick={() => navigate("/eshop")}>
            Späť na produkty
          </Button>
        </Stack>
      </Squircle>
    );
  }

  return (
    <Squircle radius="xl" className={styles.page}>
      <Stack direction="row" gap="lg" className={styles.content}>
        {/* Cart items */}
        <Box className={styles.cartSection}>
          <Text as="h2" variant="cardTitle" className={styles.heading}>
            Tvoj košík
          </Text>

          {items.length === 0 ? (
            <Text as="p" variant="body" className={styles.empty}>
              Košík je prázdny
            </Text>
          ) : (
            <Stack direction="column" gap="sm">
              {items.map((item, i) => (
                <Stack
                  key={i}
                  direction="row"
                  gap="sm"
                  className={styles.cartItem}
                >
                  <Squircle radius="xs" className={styles.itemImage}>
                    {item.product.image && (
                      <img src={item.product.image} alt={item.product.name} />
                    )}
                  </Squircle>
                  <Box className={styles.itemDetails}>
                    <Text
                      as="h3"
                      variant="body"
                      weight="bold"
                      className={styles.itemName}
                    >
                      {item.product.name}
                    </Text>
                    {Object.keys(item.variants).length > 0 && (
                      <Text
                        as="p"
                        variant="caption"
                        className={styles.itemVariants}
                      >
                        {Object.entries(item.variants)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(" • ")}
                      </Text>
                    )}
                    <Text as="p" variant="caption" className={styles.itemPrice}>
                      {item.product.priceLabel} × {item.quantity}ks
                    </Text>
                  </Box>
                </Stack>
              ))}
            </Stack>
          )}

          <Box className={styles.paymentNote}>
            <Text as="p" variant="body" weight="bold">
              Ako to funguje?
            </Text>
            <Text as="p" variant="caption" className={styles.noteText}>
              Odošleš svoju objednávku a my ťa budeme kontaktovať s detailmi o
              platbe a doručení. Platbu si môžeš vybrať sám podľa svojich
              potrieb.
            </Text>
          </Box>
        </Box>

        {/* Form */}
        <Box className={styles.formSection}>
          <Text as="h2" variant="cardTitle" className={styles.heading}>
            Tvoje údaje
          </Text>

          {error && (
            <Text as="p" variant="caption" className={styles.error}>
              {error}
            </Text>
          )}

          <form onSubmit={handleSubmit}>
            <Stack direction="column" gap="sm">
              <Box className={styles.field}>
                <Text as="label" variant="caption" weight="semibold">
                  Meno *
                </Text>
                <input
                  type="text"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Box>

              <Box className={styles.field}>
                <Text as="label" variant="caption" weight="semibold">
                  Email *
                </Text>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Box>

              <Box className={styles.field}>
                <Text as="label" variant="caption" weight="semibold">
                  Telefón
                </Text>
                <input
                  type="tel"
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Box>

              <Box className={styles.field}>
                <Text as="label" variant="caption" weight="semibold">
                  Správa
                </Text>
                <textarea
                  className={styles.textarea}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Tvoje poznámky k objednávke…"
                />
              </Box>

              <Button
                type="submit"
                variant="primary"
                disabled={submitting || items.length === 0}
              >
                {submitting ? "Odosielam…" : "Odoslať objednávku"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Squircle>
  );
}
