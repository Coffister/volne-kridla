import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Container, Section, Stack, Text } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import { site, type Product } from "@/content";

import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import CheckoutModal from "./CheckoutModal";
import { useCart } from "@/lib/CartContext";
import styles from "./Eshop.module.css";

export default function Eshop() {
  const products = site.products;
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId?: string }>();

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  // Deep-link support: /eshop/produkt/:productId opens the detail modal directly.
  useEffect(() => {
    if (!productId) {
      setDetailProduct(null);
      return;
    }
    const found = products.find((p) => p.id === productId);
    setDetailProduct(found ?? null);
  }, [productId, products]);

  const openDetail = (product: Product) => {
    navigate(`/eshop/produkt/${product.id}`);
  };

  const closeDetail = () => {
    navigate("/eshop");
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, {}, 1);
    setJustAdded(product.id);
    setTimeout(() => setJustAdded((cur) => (cur === product.id ? null : cur)), 1200);
  };

  const handleOpenCheckout = (_product: Product, _variants: Record<string, string>) => {
    // Product + selected variants were already added to the cart by the
    // detail modal before calling this — checkout just reviews the cart.
    setDetailProduct(null);
    navigate("/eshop");
    setCheckoutOpen(true);
  };

  return (
    <Section id="eshop" className={styles.section}>
      <Container>
        <Stack direction="column" align="center" gap="sm" className={styles.heading}>
          <Text as="h1" variant="sectionTitle" className={styles.title}>
            E-shop
          </Text>
          <Badge>Produkty pre teba a tvojho papagája</Badge>
        </Stack>

        {products.length === 0 ? (
          <Text as="p" variant="body" className={styles.empty}>
            Produkty sa práve pripravujú — čoskoro tu nájdeš viac.
          </Text>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <div key={product.id} className={styles.cardSlot}>
                <ProductCard
                  product={product}
                  onViewDetails={openDetail}
                  onAddToCart={handleAddToCart}
                />
                {justAdded === product.id && (
                  <div className={styles.addedToast}>Pridané do košíka ✓</div>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={closeDetail}
          onOpenCheckout={handleOpenCheckout}
        />
      )}

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </Section>
  );
}
