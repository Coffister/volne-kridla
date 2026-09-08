import { useState } from "react";
import { createPortal } from "react-dom";
import type { Product, ProductVariant } from "@/content";
import { Stack, Text } from "@/ui/primitives";
import Button from "@/ui/components/Button";
import { useCart } from "@/lib/CartContext";
import { colorHex } from "@/content/colorPalette";
import styles from "./ProductDetailModal.module.css";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onOpenCheckout: (product: Product, variants: Record<string, string>) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onOpenCheckout,
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

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
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

  const handleCheckout = () => {
    addItem(product, selectedVariants, 1);
    onOpenCheckout(product, selectedVariants);
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
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Zavrieť">
          ✕
        </button>

        <button className={styles.shareBtn} onClick={handleShare} aria-label="Zdieľať produkt">
          {linkCopied ? "✓ Odkaz skopírovaný" : "↗ Zdieľať"}
        </button>

        <div className={styles.content}>
          {/* Image carousel */}
          <div className={styles.imageSection}>
            {allImages.length > 0 && (
              <>
                <img src={currentImage} alt={product.name} className={styles.mainImage} />
                {allImages.length > 1 && (
                  <div className={styles.carousel}>
                    <button onClick={prevImage} className={styles.carouselBtn}>
                      ‹
                    </button>
                    <div className={styles.indicators}>
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          className={`${styles.indicator} ${i === currentImageIndex ? styles.active : ""}`}
                          onClick={() => setCurrentImageIndex(i)}
                          aria-label={`Obrázok ${i + 1}`}
                        />
                      ))}
                    </div>
                    <button onClick={nextImage} className={styles.carouselBtn}>
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Details */}
          <div className={styles.details}>
            {product.sku && (
              <Text as="span" variant="body" className={styles.sku}>
                {product.sku}
              </Text>
            )}

            <Text as="h1" variant="sectionTitle" className={styles.title}>
              {product.name}
            </Text>

            {product.priceLabel && (
              <Text as="div" className={styles.price}>
                {product.priceLabel}
              </Text>
            )}

            {product.inStock !== undefined && (
              <Text
                as="p"
                variant="body"
                className={`${styles.stock} ${product.inStock ? styles.inStock : styles.outOfStock}`}
              >
                {product.inStock
                  ? `Skladom${product.stockCount ? ` (${product.stockCount}ks)` : ""}`
                  : "Vypredané"}
              </Text>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <Stack direction="column" gap="md" className={styles.variants}>
                {product.variants.map((variant: ProductVariant) => (
                  <div key={variant.label} className={styles.variantGroup}>
                    <label className={styles.variantLabel}>{variant.label}:</label>
                    <div className={styles.variantOptions}>
                      {variant.options.map((option: string) =>
                        variant.isColor ? (
                          <button
                            key={option}
                            type="button"
                            title={option}
                            className={`${styles.colorSwatch} ${
                              selectedVariants[variant.label] === option ? styles.selected : ""
                            }`}
                            style={{ background: colorHex(option) }}
                            onClick={() => handleVariantSelect(variant.label, option)}
                          />
                        ) : (
                          <button
                            key={option}
                            type="button"
                            className={`${styles.variantOption} ${
                              selectedVariants[variant.label] === option ? styles.selected : ""
                            }`}
                            onClick={() => handleVariantSelect(variant.label, option)}
                          >
                            {option}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </Stack>
            )}

            {/* Description */}
            {product.description && (
              <Text as="p" variant="body" className={styles.description}>
                {product.description}
              </Text>
            )}

            {/* Actions */}
            <div className={styles.actions}>
              <Button
                variant="secondary"
                onClick={handleAddToCart}
                className={styles.cartBtn}
              >
                {addedToCart ? "✓ Pridané" : "🛒 Do košíka"}
              </Button>
              <Button
                variant="primary"
                onClick={handleCheckout}
                disabled={product.inStock === false}
              >
                Objednať
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews — placeholder until product-specific reviews are collected */}
        <div className={styles.reviewsSection}>
          <Text as="h2" variant="sectionSubtitle" className={styles.reviewsHeading}>
            Recenzie
          </Text>
          <Text as="p" variant="body" className={styles.reviewsEmpty}>
            K tomuto produktu zatiaľ nemáme žiadne recenzie. Buď prvý, kto ho vyskúša!
          </Text>
        </div>
      </div>
    </div>,
    document.body,
  );
}
