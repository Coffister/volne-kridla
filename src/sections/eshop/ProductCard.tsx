import type { Product } from "@/content";
import { Squircle, Stack, Text, Image } from "@/ui/primitives";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Squircle radius="xl" className={styles.card}>
      <div
        className={styles.clickableArea}
        onClick={() => onViewDetails(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onViewDetails(product);
        }}
      >
        {product.sku && (
          <Text as="span" variant="body" className={styles.sku}>
            {product.sku}
          </Text>
        )}

        <div className={styles.imageWrap}>
          {product.image ? (
            <Image src={product.image} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden />
          )}
        </div>

        <Text as="h2" variant="sectionSubtitle" className={styles.name}>
          {product.name}
        </Text>

        {product.description && (
          <Text as="p" variant="body" className={styles.description}>
            {product.description}
          </Text>
        )}
      </div>

      <Stack direction="row" align="flex-end" justify="space-between" className={styles.footer}>
        <Stack direction="column" gap="xs">
          {product.priceLabel && (
            <Text as="span" variant="body" weight="bold" className={styles.price}>
              {product.priceLabel}
            </Text>
          )}
          {product.inStock !== undefined && (
            <Text
              as="span"
              variant="body"
              className={`${styles.stock} ${product.inStock ? styles.inStock : styles.outOfStock}`}
            >
              {product.inStock
                ? `Skladom${product.stockCount ? ` (${product.stockCount}ks)` : ""}`
                : "Vypredané"}
            </Text>
          )}
        </Stack>

        <button
          type="button"
          className={styles.cartButton}
          onClick={() => onAddToCart(product)}
          disabled={product.inStock === false}
          aria-label="Pridať do košíka"
        >
          🛒
        </button>
      </Stack>
    </Squircle>
  );
}
