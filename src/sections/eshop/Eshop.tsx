import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Container, Section, Squircle, Stack, Text } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import Button from "@/ui/components/Button";
import SortIcon from "@/ui/icons/SortIcon";
import CartButton from "@/features/navigation/CartButton/CartButton";
import { site, type Product } from "@/content";
import { PRODUCT_CATEGORIES } from "@/content/categories";

import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import CheckoutModal from "./CheckoutModal";
import { useCart } from "@/lib/CartContext";
import styles from "./Eshop.module.css";

const CATEGORY_TABS = [{ value: "", label: "Všetky produkty" }, ...PRODUCT_CATEGORIES];

export default function Eshop() {
  const allProducts = site.products;
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId?: string }>();

  const [activeCategory, setActiveCategory] = useState("");
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [linkCopiedFor, setLinkCopiedFor] = useState<string | null>(null);

  const products = activeCategory
    ? allProducts.filter((p) => p.category === activeCategory)
    : allProducts;

  // Deep-link support: /eshop/produkt/:productId opens the detail modal directly.
  useEffect(() => {
    if (!productId) {
      setDetailProduct(null);
      return;
    }
    const found = allProducts.find((p) => p.id === productId);
    setDetailProduct(found ?? null);
  }, [productId, allProducts]);

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

  const handleShare = async (product: Product) => {
    const url = `${window.location.origin}/eshop/produkt/${product.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setLinkCopiedFor(product.id);
      setTimeout(() => setLinkCopiedFor((cur) => (cur === product.id ? null : cur)), 1500);
    } catch {
      // user cancelled the share sheet, or clipboard denied — no-op
    }
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

        <Squircle radius="md" className={styles.toolbar}>
          <Stack direction="row" align="center" justify="space-between" gap="md" wrap="wrap">
            <Stack direction="row" gap="md" className={styles.tabs}>
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  className={styles.tab}
                  onClick={() => setActiveCategory(tab.value)}
                >
                  <Text
                    as="span"
                    variant="body"
                    weight="bold"
                    style={{
                      color:
                        activeCategory === tab.value
                          ? "var(--color-accent-primary)"
                          : "var(--color-text-primary)",
                    }}
                  >
                    {tab.label}
                  </Text>
                </button>
              ))}
            </Stack>

            <Stack direction="row" align="center" gap="sm">
              <Button variant="navbar" icon={<SortIcon />}>
                Zoradiť
              </Button>
              <CartButton />
            </Stack>
          </Stack>
        </Squircle>

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
                  onShare={handleShare}
                />
                {justAdded === product.id && (
                  <div className={styles.addedToast}>Pridané do košíka ✓</div>
                )}
                {linkCopiedFor === product.id && (
                  <div className={styles.addedToast}>Odkaz skopírovaný ✓</div>
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
