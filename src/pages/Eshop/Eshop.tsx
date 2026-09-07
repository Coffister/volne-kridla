import { useParams } from "react-router-dom";

import EshopSection from "@/sections/eshop";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { site } from "@/content";

export default function Eshop() {
  const { productId } = useParams<{ productId?: string }>();
  const product = productId ? site.products.find((p) => p.id === productId) : undefined;

  useDocumentMeta(
    product
      ? {
          title: product.name,
          description:
            product.description ||
            `${product.name} — ${product.priceLabel || "pozri detail"} na Voľné krídla e-shope.`,
          path: `/eshop/produkt/${product.id}`,
          image: product.image || undefined,
        }
      : {
          title: "E-shop",
          description: "Produkty pre teba a tvojho papagája — objednaj si cez jednoduchý formulár.",
          path: "/eshop",
        },
  );

  return <EshopSection />;
}
