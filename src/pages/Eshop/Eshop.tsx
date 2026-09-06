import EshopSection from "@/sections/eshop";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function Eshop() {
  useDocumentMeta({
    title: "E-shop",
    description: "Produkty pre teba a tvojho papagája — objednaj si cez jednoduchý formulár.",
    path: "/eshop",
  });

  return <EshopSection />;
}
