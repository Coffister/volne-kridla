import { useState } from "react";
import type { Product, ProductVariant } from "@/content";
import { useCart } from "@/lib/CartContext";
import styles from "./ProductPage.module.css";
import { Box, Container, Stack, Text, Image, Squircle } from "@/ui/primitives";
import Button from "@/ui/components/Button";

interface ProductPageProps {
  product: Product;
  onBack: () => void;
}

// Intentionally bare — this is the container the product detail gets
// hand-designed into. The placeholders below just wire up the data and
// behavior that vary per product (image, description, price, stock,
// variants, add-to-cart/share); replace the markup, keep the wiring.
export default function ProductPage({ product, onBack }: ProductPageProps) {
  const { addItem } = useCart();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
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
    <div className={styles.page}>
      <Squircle radius="xl"><button type="button" onClick={onBack} className={styles.backLink}>
        ← Späť na produkty
      </button></Squircle>

      <Container>
        <Box>
          <Squircle radius="xl">
            <Stack direction="row" >
              {product.image && <Image src={product.image} alt={product.name} className={styles.image} />}
              <Box className="{styles.productInfo}">
                      {/* NÁZOV — product.name */}
      <Text as="h1" className={styles.name}>{product.name}</Text>

{/* POPIS — product.description */}
{product.description && <Text as="p" className={styles.description}>{product.description}</Text>}

{/* VARIANTY — product.variants (label, isColor, options[]) */}
{product.variants && product.variants.length > 0 && (
  <div className={styles.variants}>
    {product.variants.map((variant: ProductVariant) => (
      <div key={variant.label}>
        <label>{variant.label}</label>
        <select
          value={selectedVariants[variant.label] || ""}
          onChange={(e) => handleVariantSelect(variant.label, e.target.value)}
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
      </div>
    ))}
  </div>
)}
              </Box>
            </Stack>
          </Squircle>
        </Box>
      </Container>

      {/* OBRÁZOK — product.image (+ product.images pre galériu) */}
      {product.image && <Image src={product.image} alt={product.name} className={styles.image} />}

      {/* NÁZOV — product.name */}
      <Text as="h1" className={styles.name}>{product.name}</Text>

      {/* POPIS — product.description */}
      {product.description && <Text as="p" className={styles.description}>{product.description}</Text>}
      
      {/* VARIANTY — product.variants (label, isColor, options[]) */}
      {product.variants && product.variants.length > 0 && (
        <div className={styles.variants}>
          {product.variants.map((variant: ProductVariant) => (
            <div key={variant.label}>
              <label>{variant.label}</label>
              <select
                value={selectedVariants[variant.label] || ""}
                onChange={(e) => handleVariantSelect(variant.label, e.target.value)}
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
            </div>
          ))}
        </div>
      )}

      {/* CENA — product.priceLabel */}
      {product.priceLabel && <div className={styles.price}>{product.priceLabel}</div>}

      {/* DOSTUPNOSŤ — product.inStock / product.stockCount */}
      {product.inStock !== undefined && (
        <div className={styles.stock}>
          {product.inStock
            ? `Dostupné${product.stockCount ? ` (${product.stockCount}ks)` : ""}`
            : "Vypredané"}
        </div>
      )}

      {/* AKCIE */}
      <div className={styles.actions}>
        <Button type="button" onClick={handleShare}>
          {linkCopied ? "Odkaz skopírovaný" : "Zdieľať"}
        </Button>
        <Button type="button" onClick={handleAddToCart} disabled={product.inStock === false}>
          {addedToCart ? "Pridané" : "Pridať do košíka"}
        </Button>
      </div>
    </div>
  );
}
