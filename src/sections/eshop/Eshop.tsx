import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShareNetwork, ShoppingCart } from "@phosphor-icons/react";

import { Container, Section, Squircle, Stack, Text } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import Button from "@/ui/components/Button";
import SortIcon from "@/ui/icons/SortIcon";
import CartButton from "@/features/navigation/CartButton/CartButton";
import { site, type Product } from "@/content";
import { PRODUCT_CATEGORIES } from "@/content/categories";

import ProductCard from "./ProductCard";
import ProductPage from "./ProductPage";
import CheckoutPage from "./CheckoutPage";
import { useCart } from "@/lib/CartContext";
import styles from "./Eshop.module.css";

export default function Eshop() {
  const allProducts = site.products;
  const usedCategories = PRODUCT_CATEGORIES.filter((cat) =>
    allProducts.some((p) => p.category === cat.value),
  );
  const categoryTabs = [
    { value: "", label: "Všetky produkty" },
    ...usedCategories,
  ];
  const { addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams<{ productId?: string }>();
  const isCheckout = location.pathname === "/eshop/checkout";

  const [activeCategory, setActiveCategory] = useState("");
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
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
    setTimeout(
      () => setJustAdded((cur) => (cur === product.id ? null : cur)),
      1200,
    );
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
      setTimeout(
        () => setLinkCopiedFor((cur) => (cur === product.id ? null : cur)),
        1500,
      );
    } catch {
      // user cancelled the share sheet, or clipboard denied — no-op
    }
  };

  return (
    <Section id="eshop" className={styles.section}>
      <Container>
        <Stack
          direction="column"
          align="center"
          gap="sm"
          className={styles.heading}
        >
          <Text as="h1" variant="sectionTitle" className={styles.title}>
            E-shop
          </Text>
          <Badge>Produkty pre teba a tvojho papagája</Badge>
        </Stack>

        <Squircle radius="sm" className={styles.toolbar}>
          <Stack
            direction="row"
            align="center"
            justify="space-between"
            gap="sm"
            wrap="wrap"
          >
            {isCheckout ? (
              <Button
                variant="secondary"
                icon={<ArrowLeft size={18} weight="bold" />}
                onClick={closeDetail}
              >
                Späť na produkty
              </Button>
            ) : detailProduct ? (
              <Stack
                direction="column"
                gap="sm"
                className={styles.detailToolbar}
              >
                <Button
                  variant="navbar"
                  icon={<ShoppingCart size={20} weight="bold" />}
                  fullWidth
                  className={styles.mobileCartCta}
                  onClick={() => navigate("/eshop/checkout")}
                >
                  Prejsť do košíka
                </Button>

                <Stack
                  direction="row"
                  align="center"
                  justify="space-between"
                  gap="sm"
                  wrap="wrap"
                >
                  <Button
                    variant="secondary"
                    icon={<ArrowLeft size={18} weight="bold" />}
                    onClick={closeDetail}
                    className={styles.backButtonText}
                  >
                    Späť na produkty
                  </Button>
                  <Button
                    variant="secondary"
                    size="square"
                    icon={<ArrowLeft size={18} weight="bold" />}
                    onClick={closeDetail}
                    ariaLabel="Späť na produkty"
                    className={styles.backButtonIcon}
                  />

                  <Stack direction="row" align="center" gap="sm">
                    <Button
                      variant="secondary"
                      icon={<ShareNetwork size={20} weight="bold" />}
                      onClick={() => handleShare(detailProduct)}
                    >
                      {linkCopiedFor === detailProduct.id
                        ? "Odkaz skopírovaný"
                        : "Zdieľať"}
                    </Button>
                    <CartButton className={styles.desktopCartIcon} />
                  </Stack>
                </Stack>
              </Stack>
            ) : (
              <Stack
                direction="column"
                gap="sm"
                className={styles.detailToolbar}
              >
                <Button
                  variant="navbar"
                  icon={<ShoppingCart size={20} weight="bold" />}
                  fullWidth
                  className={styles.mobileCartCta}
                  onClick={() => navigate("/eshop/checkout")}
                >
                  Prejsť do košíka
                </Button>

                <Stack
                  direction="row"
                  align="center"
                  justify="space-between"
                  gap="sm"
                  wrap="wrap"
                >
                  <Stack direction="row" gap="sm" className={styles.tabs}>
                    {categoryTabs.map((tab) => (
                      <button
                        key={tab.value}
                        type="button"
                        className={styles.tab}
                        onClick={() => setActiveCategory(tab.value)}
                      >
                        <Text
                          as="span"
                          variant="caption"
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
                    <CartButton className={styles.desktopCartIcon} />
                  </Stack>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Squircle>

        {isCheckout ? (
          <CheckoutPage />
        ) : detailProduct ? (
          <ProductPage product={detailProduct} />
        ) : products.length === 0 ? (
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
    </Section>
  );
}
