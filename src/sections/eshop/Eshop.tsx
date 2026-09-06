import { useState } from "react";

import { Container, Section, Squircle, Stack, Text, Image } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import Button from "@/ui/components/Button";
import { site } from "@/content";

import OrderModal from "./OrderModal";
import styles from "./Eshop.module.css";

export default function Eshop() {
  const [activeProduct, setActiveProduct] = useState<{ id: string; name: string } | null>(null);
  const products = site.products;

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
              <Squircle key={product.id} radius="xl" className={styles.card}>
                <div className={styles.imageWrap}>
                  {product.image ? (
                    <Image src={product.image} alt={product.name} className={styles.image} />
                  ) : (
                    <div className={styles.imagePlaceholder} aria-hidden />
                  )}
                </div>
                <Stack direction="column" gap="xs" className={styles.body}>
                  <Text as="h2" variant="sectionSubtitle" className={styles.name}>
                    {product.name}
                  </Text>
                  {product.description && (
                    <Text as="p" variant="body" className={styles.description}>
                      {product.description}
                    </Text>
                  )}
                  <Stack direction="row" align="center" justify="space-between" className={styles.footer}>
                    {product.priceLabel && (
                      <Text as="span" variant="body" weight="bold" className={styles.price}>
                        {product.priceLabel}
                      </Text>
                    )}
                    <Button
                      variant="primary"
                      onClick={() => setActiveProduct({ id: product.id, name: product.name })}
                    >
                      Mám záujem
                    </Button>
                  </Stack>
                </Stack>
              </Squircle>
            ))}
          </div>
        )}
      </Container>

      {activeProduct && (
        <OrderModal
          productId={activeProduct.id}
          productName={activeProduct.name}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </Section>
  );
}
