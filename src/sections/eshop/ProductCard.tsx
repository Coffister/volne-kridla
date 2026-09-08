import type { Product } from "@/content";
import { Squircle, Text, Image } from "@/ui/primitives";
import cartIcon from "@/assets/icons/cart-filled.png";
import shareIcon from "@/assets/icons/share-filled.png";
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
  return (
    <Squircle radius="2xl" className={styles.card}>
      <div
        className={styles.clickableArea}
        onClick={() => onViewDetails(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onViewDetails(product);
        }}
      >
        <Squircle radius="lg" className={styles.imageWrap}>
          {product.image ? (
            <Image src={product.image} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden />
          )}
        </Squircle>

        <div className={styles.info}>
          <Text as="h2" className={styles.name}>
            {product.name}
          </Text>

          {product.description && (
            <Text as="p" className={styles.description}>
              {product.description}
            </Text>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.priceBlock}>
          {product.priceLabel && <Text as="p" className={styles.price}>{product.priceLabel}</Text>}
          {product.inStock !== undefined && (
            <Text as="p" className={styles.stock}>
              {product.inStock
                ? `Dostupné${product.stockCount ? ` (${product.stockCount}ks)` : ""}`
                : "Vypredané"}
            </Text>
          )}
        </div>

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onAddToCart(product)}
            disabled={product.inStock === false}
            aria-label="Pridať do košíka"
          >
            <img src={cartIcon} alt="" className={styles.icon} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onShare(product)}
            aria-label="Zdieľať produkt"
          >
            <img src={shareIcon} alt="" className={styles.icon} />
          </button>
        </div>
      </div>
    </Squircle>
  );
}
