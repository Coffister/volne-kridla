import { useState } from "react";
import { createPortal } from "react-dom";
import { X, ShareNetwork, ShoppingCart } from "@phosphor-icons/react";
import type { Product, ProductVariant } from "@/content";
import { Squircle, Stack, Text } from "@/ui/primitives";
import { colorHex } from "@/content/colorPalette";
import { useCart } from "@/lib/CartContext";
import styles from "./ProductDetailModal.module.css";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onOpenCheckout: (product: Product, variants: Record<string, string>) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  const { addItem } = useCart();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleVariantSelect = (type: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleAddToCart = () => {
    addItem(product, selectedVariants, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/eshop/produkt/${product.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
    } catch {
      // user cancelled the share sheet, or clipboard denied — no-op
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <Squircle radius="3xl" className={styles.modal}>
        <div onClick={(e) => e.stopPropagation()} className={styles.grid}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Zavrieť">
            <X size={18} weight="bold" />
          </button>

          <Squircle radius="2xl" className={styles.imageWrap}>
            {product.image && (
              <img src={product.image} alt={product.name} className={styles.mainImage} />
            )}
          </Squircle>

          <div className={styles.info}>
            <Stack direction="column" gap="md">
              <Text
                as="h1"
                weight="extrabold"
                className={styles.title}
                style={{
                  fontFamily: "var(--font-family-display)",
                  fontSize: "48px",
                  letterSpacing: "-0.96px",
                  lineHeight: "normal",
                }}
              >
                {product.name}
              </Text>

              {product.description && (
                <Text as="p" variant="caption" weight="medium" className={styles.description}>
                  {product.description}
                  {product.variants && product.variants.length > 0 && (
                    <>
                      <br />
                      <br />
                      Prispôsobte si farebnosť vášej fantázii.
                    </>
                  )}
                </Text>
              )}

              <div className={styles.divider} />
            </Stack>

            {product.variants && product.variants.length > 0 && (
              <Stack direction="column" gap="sm">
                {product.variants.map((variant: ProductVariant) => (
                  <Stack key={variant.label} direction="column" gap="xs">
                    <Text as="label" variant="caption" weight="semibold" className={styles.variantLabel}>
                      {variant.label}
                    </Text>
                    {variant.isColor ? (
                      <Stack direction="row" gap="xs">
                        {variant.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            title={option}
                            className={`${styles.swatch} ${
                              selectedVariants[variant.label] === option ? styles.swatchSelected : ""
                            }`}
                            style={{ background: colorHex(option) }}
                            onClick={() => handleVariantSelect(variant.label, option)}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <select
                        required
                        className={styles.select}
                        value={selectedVariants[variant.label] || ""}
                        onChange={(e) => handleVariantSelect(variant.label, e.target.value)}
                      >
                        <option value="" disabled>
                          zvolte možnosť
                        </option>
                        {variant.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </Stack>
                ))}

                <div className={styles.divider} />
              </Stack>
            )}

            <div className={styles.priceRow}>
              {product.priceLabel && (
                <Text
                  as="div"
                  className={styles.price}
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: "var(--font-weight-extrabold)",
                    fontSize: "64px",
                  }}
                >
                  {product.priceLabel}
                </Text>
              )}

              {product.inStock !== undefined && (
                <Text as="p" variant="caption" weight="semibold" className={styles.stock}>
                  {product.inStock
                    ? `Dostupné${product.stockCount ? ` (${product.stockCount}ks)` : ""}`
                    : "Vypredané"}
                </Text>
              )}
            </div>

            <Stack direction="row" justify="space-between" className={styles.actions}>
              <button
                type="button"
                className={styles.shareBtn}
                onClick={handleShare}
                aria-label={linkCopied ? "Odkaz skopírovaný" : "Zdieľať produkt"}
              >
                <ShareNetwork size={32} weight="bold" />
              </button>

              <button
                type="button"
                className={styles.cartBtn}
                disabled={product.inStock === false}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={26} weight="bold" color="var(--color-text-secondary)" />
                <Text as="span" variant="body" weight="bold" className={styles.cartBtnLabel}>
                  {addedToCart ? "Pridané" : "Pridať do košíka"}
                </Text>
              </button>
            </Stack>
          </div>
        </div>
      </Squircle>
    </div>,
    document.body,
  );
}
