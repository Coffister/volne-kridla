import { useState } from "react";
import { ArrowLeft, ShareNetwork, ShoppingCart } from "@phosphor-icons/react";
import type { Product, ProductVariant } from "@/content";
import { useCart } from "@/lib/CartContext";
import { Box, Container, Image, Squircle, Stack, Text } from "@/ui/primitives";
import Button from "@/ui/components/Button";
import dividerIcon from "@/assets/icons/dashed-divider.svg";
import styles from "./ProductPage.module.css";

interface ProductPageProps {
  product: Product;
  onBack: () => void;
}

// Intentionally bare — this is the container the product detail gets
// hand-designed into. The placeholders below just wire up the data and
// behavior that vary per product (image, description, price, stock,
// variants, add-to-cart/share); restyle freely, keep the wiring.
export default function ProductPage({ product, onBack }: ProductPageProps) {
  const { addItem } = useCart();
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleVariantSelect = (label: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [label]: value }));
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

  return (
    <Stack direction="column" gap="md" className={styles.page}>
      <Squircle radius="md" className={styles.breadcrumbs}>
        <Stack direction="row" className="generalcontrols">
          <Button
            variant="secondary"
            icon={<ArrowLeft size={18} weight="bold" />}
            onClick={onBack}
            className={styles.backLink}
          >
            Späť na produkty
          </Button>
          <Button
            variant="secondary"
            icon={<ShareNetwork size={20} weight="bold" />}
            onClick={handleShare}
          >
            {linkCopied ? "Odkaz skopírovaný" : "Zdieľať"}
          </Button>
        </Stack>
      </Squircle>

      <Container className={styles.container}>
        <Squircle radius="xl" className={styles.product}>
          <Stack direction="row" gap="lg">
            {/* OBRÁZOK — product.image (+ product.images pre galériu) */}
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                className={styles.image}
              />
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
                  <Stack
                    direction="column"
                    gap="xs"
                    className={styles.variants}
                  >
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
                    <Text
                      as="h2"
                      variant="sectionTitle"
                      className={styles.price}
                    >
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
                            product.stockCount
                              ? ` (${product.stockCount}ks)`
                              : ""
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
      </Container>
    </Stack>
  );
}
