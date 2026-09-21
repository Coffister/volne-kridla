import { useState } from "react";
import type { Product, ProductVariant } from "@/content";
import { colorHex } from "@/content/colorPalette";
import { Box, Squircle, Stack, Text } from "@/ui/primitives";
import Button from "@/ui/components/Button";
import Carousel from "@/ui/components/Carousel";
import Select from "@/ui/components/Select";
import dividerIcon from "@/assets/icons/dashed-divider.svg";
import styles from "./ProductPage.module.css";

interface ProductPageProps {
  product: Product;
  onInterest: (product: Product, variants: Record<string, string>) => void;
}

// Intentionally bare — this is the container the product detail gets
// hand-designed into. The placeholders below just wire up the data and
// behavior that vary per product (image, description, price, stock,
// variants, inquiry/share); restyle freely, keep the wiring.
// Back/share live in Eshop's toolbar (it swaps categories+sort for
// breadcrumbs when a product is open), not here.
export default function ProductPage({ product, onInterest }: ProductPageProps) {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [activeImage, setActiveImage] = useState(0);

  const handleVariantSelect = (label: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [label]: value }));
  };

  const images = [product.image, ...(product.images || [])]
    .filter(Boolean)
    .map((src, i) => ({ id: String(i), src, alt: product.name }));

  return (
    <Stack direction="column" gap="md" className={styles.page}>
      <Squircle radius="xl" className={styles.product}>
        <Stack direction="row" gap="lg" className={styles.productRow}>
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
                      {variant.isColor ? (
                        <Stack
                          direction="row"
                          align="center"
                          gap="sm"
                          wrap="wrap"
                        >
                          <Stack
                            direction="row"
                            gap="xs"
                            wrap="wrap"
                            className={styles.swatches}
                          >
                            {variant.options.map((option) => {
                              const isSelected =
                                selectedVariants[variant.label] === option;
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  title={option}
                                  aria-label={option}
                                  aria-pressed={isSelected}
                                  className={`${styles.swatch} ${
                                    isSelected ? styles.swatchSelected : ""
                                  }`}
                                  style={{
                                    backgroundColor: colorHex(option) ?? "#ccc",
                                  }}
                                  onClick={() =>
                                    handleVariantSelect(variant.label, option)
                                  }
                                />
                              );
                            })}
                          </Stack>
                          <Text as="span" variant="caption">
                            {selectedVariants[variant.label] || "zvoľte farbu"}
                          </Text>
                        </Stack>
                      ) : (
                        <Select
                          options={variant.options}
                          value={selectedVariants[variant.label] || ""}
                          onChange={(value) =>
                            handleVariantSelect(variant.label, value)
                          }
                          placeholder="zvoľte možnosť"
                        />
                      )}
                    </Stack>
                  ))}
                </Stack>
              )}
              <img src={dividerIcon} alt="" className={styles.divider} />
              <Stack direction="column" gap="xs" className={styles.pricing}>
                {/* CENA — product.priceLabel */}
                {product.priceLabel && (
                  <Text as="h2" variant="cardTitle" className={styles.price}>
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
                  onClick={() => onInterest(product, selectedVariants)}
                  disabled={product.inStock === false}
                >
                  Mám záujem
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Squircle>
    </Stack>
  );
}
