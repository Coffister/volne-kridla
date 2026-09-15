import { useState } from "react";
import { ShoppingCart } from "@phosphor-icons/react";
import type { Product, ProductVariant } from "@/content";
import { useCart } from "@/lib/CartContext";
import { Box, Squircle, Stack, Text } from "@/ui/primitives";
import Button from "@/ui/components/Button";
import Carousel from "@/ui/components/Carousel";
import dividerIcon from "@/assets/icons/dashed-divider.svg";
import styles from "./ProductPage.module.css";

interface ProductPageProps {
  product: Product;
}

// Intentionally bare — this is the container the product detail gets
// hand-designed into. The placeholders below just wire up the data and
// behavior that vary per product (image, description, price, stock,
// variants, add-to-cart/share); restyle freely, keep the wiring.
// Back/share live in Eshop's toolbar (it swaps categories+sort for
// breadcrumbs when a product is open), not here.
export default function ProductPage({ product }: ProductPageProps) {
  const { addItem } = useCart();
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const handleVariantSelect = (label: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [label]: value }));
  };

  const handleAddToCart = () => {
    addItem(product, selectedVariants, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const images = [product.image, ...(product.images || [])]
    .filter(Boolean)
    .map((src, i) => ({ id: String(i), src, alt: product.name }));

  return (
    <Stack direction="column" gap="md" className={styles.page}>
      <Squircle radius="xl" className={styles.product}>
        <Stack direction="row" gap="lg">
          {/* OBRÁZOK — product.image (+ product.images pre galériu) */}
          {images.length > 0 && (
            <Box className={styles.imageWrap}>
              <Carousel
                images={images}
                radius="lg"
                className={styles.image}
                activeIndex={activeImage}
                onActiveIndexChange={setActiveImage}
              />

              {images.length > 1 && (
                <Stack direction="column" gap="xs" className={styles.thumbs}>
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`${styles.thumb} ${
                        i === activeImage ? styles.thumbActive : ""
                      }`}
                    >
                      <img src={img.src} alt="" className={styles.thumbImage} />
                    </button>
                  ))}
                </Stack>
              )}
            </Box>
          )}

          <Box className={styles.productInfo}>
            <Stack direction="column" gap="sm">
              {/* NÁZOV — product.name */}
              <Text as="h1" variant="cardTitle" className={styles.name}>
                {product.name}
              </Text>

              {/* POPIS — product.description */}
              {product.description && (
                <Text as="p" className={styles.description}>
                  {product.description}
                </Text>
              )}

              {/* VARIANTY — product.variants (label, isColor, options[]) */}
              {product.variants && product.variants.length > 0 && (
                <img src={dividerIcon} alt="" className={styles.divider} />
              )}
              {product.variants && product.variants.length > 0 && (
                <Stack direction="column" gap="xs" className={styles.variants}>
                  {product.variants.map((variant: ProductVariant) => (
                    <Stack key={variant.label} direction="column" gap="xs">
                      <Text as="label" variant="caption">
                        {variant.label}
                      </Text>
                      <select
                        className={styles.selector}
                        value={selectedVariants[variant.label] || ""}
                        onChange={(e) =>
                          handleVariantSelect(variant.label, e.target.value)
                        }
                      >
                        <option value="" disabled>
                          zvoľte {variant.isColor ? "farbu" : "možnosť"}
                        </option>
                        {variant.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Stack>
                  ))}
                </Stack>
              )}
              <img src={dividerIcon} alt="" className={styles.divider} />
              <Stack direction="column" gap="xs" className={styles.pricing}>
                {/* CENA — product.priceLabel */}
                {product.priceLabel && (
                  <Text as="h2" variant="sectionTitle" className={styles.price}>
                    {product.priceLabel.includes("€")
                      ? product.priceLabel
                      : `${product.priceLabel}€`}
                  </Text>
                )}

                {/* DOSTUPNOSŤ — product.inStock / product.stockCount */}
                {product.inStock !== undefined && (
                  <Text as="p" variant="caption" className={styles.stock}>
                    {product.inStock
                      ? `Dostupné${
                          product.stockCount ? ` (${product.stockCount}ks)` : ""
                        }`
                      : "Vypredané"}
                  </Text>
                )}
              </Stack>
              {/* AKCIE */}
              <Stack direction="row" gap="sm" className={styles.actions}>
                <Button
                  variant="primary"
                  icon={<ShoppingCart size={20} weight="bold" />}
                  onClick={handleAddToCart}
                  disabled={product.inStock === false}
                >
                  {addedToCart ? "Pridané" : "Pridať do košíka"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Squircle>
    </Stack>
  );
}
