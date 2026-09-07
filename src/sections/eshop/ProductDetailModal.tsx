import { useState } from "react";
import { createPortal } from "react-dom";
import { Product } from "@/content";
import { Container, Stack, Text } from "@/ui/primitives";
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
  onOpenCheckout,
}: ProductDetailModalProps) {
  const { addItem } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [addedToCart, setAddedToCart] = useState(false);

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
    onOpenCheckout(product, selectedVariants);
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Zavřít">
          ✕
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
                          aria-label={`Obrázek ${i + 1}`}
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
            {product.sku && <div className={styles.sku}>{product.sku}</div>}

            <Text as="h1" variant="sectionTitle" className={styles.title}>
              {product.name}
            </Text>

            {product.priceLabel && (
              <Text as="div" className={styles.price}>
                {product.priceLabel}
              </Text>
            )}

            {product.inStock !== undefined && (
              <div
                className={`${styles.stock} ${product.inStock ? styles.inStock : styles.outOfStock}`}
              >
                {product.inStock
                  ? `Skladem${product.stockCount ? ` (${product.stockCount}ks)` : ""}`
                  : "Vyprodáno"}
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <Stack direction="column" gap="md" className={styles.variants}>
                {product.variants.map((variant) => (
                  <div key={variant.type} className={styles.variantGroup}>
                    <label className={styles.variantLabel}>
                      {variant.type === "color" ? "Barva" : "Velikost"}:
                    </label>
                    <div className={styles.variantOptions}>
                      {variant.options.map((option) => (
                        <button
                          key={option}
                          className={`${styles.variantOption} ${
                            selectedVariants[variant.type] === option ? styles.selected : ""
                          }`}
                          onClick={() => handleVariantSelect(variant.type, option)}
                        >
                          {option}
                        </button>
                      ))}
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
                {addedToCart ? "✓ Přidáno" : "🛒 Do kôša"}
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
      </div>
    </div>,
    document.body,
  );
}
