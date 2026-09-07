import type { Product } from "@/content";
import { Squircle, Stack, Text, Image } from "@/ui/primitives";
import CartIcon from "@/ui/icons/CartIcon";
import ShareIcon from "@/ui/icons/ShareIcon";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onShare: (product: Product) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  onShare,
}: ProductCardProps) {
  const priceLabel =
    product.priceLabel && !product.priceLabel.includes("€")
      ? `${product.priceLabel}€`
      : product.priceLabel;

  return (
    <Squircle radius="lg" className={styles.card}>
      <div
        className={styles.clickableArea}
        onClick={() => onViewDetails(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onViewDetails(product);
        }}
      >
        <Squircle radius="md" className={styles.imageWrap}>
          {product.image ? (
            <Image src={product.image} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden />
          )}
        </Squircle>

        <Text as="h2" variant="cardTitle" className={styles.name}>
          {product.name}
        </Text>

        {product.description && (
          <Text as="p" variant="caption" className={styles.description}>
            {product.description}
          </Text>
        )}
      </div>

      <Stack direction="row" align="center" justify="space-between" className={styles.footer}>
        <Stack direction="column" className={styles.priceInfo}>
          {priceLabel && (
            <Text as="span" variant="body" weight="bold" className={styles.price}>
              {priceLabel}
            </Text>
          )}
          {product.inStock !== undefined && (
            <Text as="span" variant="caption" weight="bold" className={styles.stock}>
              {product.inStock
                ? `Dostupné${product.stockCount ? ` (${product.stockCount}ks)` : ""}`
                : "Vypredané"}
            </Text>
          )}
        </Stack>

        <Stack direction="row" gap="xs">
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onShare(product)}
            aria-label="Zdieľať produkt"
          >
            <ShareIcon />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onAddToCart(product)}
            disabled={product.inStock === false}
            aria-label="Pridať do košíka"
          >
            <CartIcon />
          </button>
        </Stack>
      </Stack>
    </Squircle>
  );
}
