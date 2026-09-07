import { Product } from "@/content";
import { Container, Stack, Text } from "@/ui/primitives";
import Button from "@/ui/components/Button";
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
    <div className={styles.card}>
      {/* Click on card to view details */}
      <div
        className={styles.clickableArea}
        onClick={() => onViewDetails(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onViewDetails(product);
        }}
      >
        {/* Image */}
        <div className={styles.imageWrap}>
          {product.image ? (
            <img src={product.image} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden />
          )}
        </div>

        {/* SKU Code */}
        {product.sku && <div className={styles.sku}>{product.sku}</div>}

        {/* Title */}
        <Text as="h2" variant="sectionSubtitle" className={styles.name}>
          {product.name}
        </Text>

        {/* Description (truncated) */}
        {product.description && (
          <Text as="p" variant="body" className={styles.description}>
            {product.description.length > 80
              ? `${product.description.substring(0, 80)}…`
              : product.description}
          </Text>
        )}
      </div>

      {/* Footer: Price + Stock + Add to Cart button */}
      <div className={styles.footer}>
        <div className={styles.priceAndStock}>
          {product.priceLabel && (
            <Text as="span" variant="body" weight="bold" className={styles.price}>
              {product.priceLabel}
            </Text>
          )}
          {product.inStock !== undefined && (
            <div className={`${styles.stock} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
              {product.inStock
                ? `Skladem${product.stockCount ? ` (${product.stockCount}ks)` : ""}`
                : "Vyprodáno"}
            </div>
          )}
        </div>

        <Button
          variant="primary"
          onClick={() => onAddToCart(product)}
          disabled={product.inStock === false}
          className={styles.cartButton}
        >
          🛒
        </Button>
      </div>
    </div>
  );
}
