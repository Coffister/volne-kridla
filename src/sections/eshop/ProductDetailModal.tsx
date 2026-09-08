import { useState } from "react";
import { createPortal } from "react-dom";
import { X, CaretRight, ShareNetwork, ShoppingCart } from "@phosphor-icons/react";
import type { Product, ProductVariant } from "@/content";
import { Box, Squircle, Stack, Text } from "@/ui/primitives";
import Button from "@/ui/components/Button";
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Get all images (primary + carousel)
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const currentImage = allImages[currentImageIndex] || product.image;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

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
      <Squircle radius="lg" className={styles.modal}>
        <Box className={styles.modalInner} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Zavrieť">
            <X size={20} weight="bold" />
          </button>

          <div className={styles.content}>
            {/* Image carousel */}
            <Stack direction="column" gap="sm" className={styles.imageSection}>
              {allImages.length > 0 && (
                <>
                  <Squircle
                    radius="md"
                    borderWidth={2}
                    borderColor="var(--color-border-primary)"
                    className={styles.imageWrap}
                  >
                    <img src={currentImage} alt={product.name} className={styles.mainImage} />
                    {allImages.length > 1 && (
                      <button
                        type="button"
                        onClick={nextImage}
                        className={styles.navBtn}
                        aria-label="Ďalší obrázok"
                      >
                        <CaretRight size={18} weight="bold" />
                      </button>
                    )}
                  </Squircle>

                  {allImages.length > 1 && (
                    <Stack direction="row" gap="xs">
                      {allImages.map((img, i) => (
                        <Squircle
                          key={i}
                          radius="xs"
                          borderWidth={2}
                          borderColor="var(--color-border-primary)"
                          className={styles.thumb}
                        >
                          <button
                            type="button"
                            className={styles.thumbBtn}
                            onClick={() => setCurrentImageIndex(i)}
                            aria-label={`Obrázok ${i + 1}`}
                          >
                            <img src={img} alt="" className={styles.thumbImage} />
                          </button>
                        </Squircle>
                      ))}
                    </Stack>
                  )}
                </>
              )}
            </Stack>

            {/* Details */}
            <Stack direction="column" gap="sm" className={styles.details}>
              <Text as="h1" variant="cardTitle" className={styles.title}>
                {product.name}
              </Text>

              {product.description && (
                <Text as="p" variant="body" className={styles.description}>
                  {product.description}
                </Text>
              )}

              {product.variants && product.variants.length > 0 && (
                <>
                  <Text as="p" variant="caption" weight="medium" className={styles.hint}>
                    Prispôsobte si farebnosť vášej fantázii.
                  </Text>

                  <div className={styles.divider} />

                  <Stack direction="column" gap="sm">
                    {product.variants.map((variant: ProductVariant) => (
                      <Stack key={variant.label} direction="column" gap="xs">
                        <Text
                          as="label"
                          variant="caption"
                          weight="semibold"
                          className={styles.variantLabel}
                        >
                          {variant.label}
                        </Text>
                        <select
                          required
                          className={styles.select}
                          value={selectedVariants[variant.label] || ""}
                          onChange={(e) => handleVariantSelect(variant.label, e.target.value)}
                        >
                          <option value="" disabled>
                            zvolte {variant.isColor ? "farbu" : "možnosť"}
                          </option>
                          {variant.options.map((option: string) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </Stack>
                    ))}
                  </Stack>
                </>
              )}

              <div className={styles.divider} />

              <div className={styles.priceRow}>
                {product.priceLabel && (
                  <Text as="div" className={styles.price}>
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

              <Stack direction="row" gap="sm" className={styles.actions}>
                <button
                  type="button"
                  className={styles.shareBtn}
                  onClick={handleShare}
                  aria-label={linkCopied ? "Odkaz skopírovaný" : "Zdieľať produkt"}
                >
                  <ShareNetwork size={22} weight="bold" />
                </button>
                <Button
                  variant="primary"
                  icon={<ShoppingCart size={22} weight="bold" />}
                  className={styles.cartBtn}
                  fullWidth
                  disabled={product.inStock === false}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? "Pridané" : "Pridať do košíka"}
                </Button>
              </Stack>
            </Stack>
          </div>
        </Box>
      </Squircle>
    </div>,
    document.body,
  );
}
