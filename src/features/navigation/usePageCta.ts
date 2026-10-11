import { useLocation } from "react-router-dom";

import { useKonzultaciaModal } from "@/features/konzultacia-modal";
import { scrollToSection } from "@/lib/scrollToSection";

// The navbar / mobile bar CTA is "Začať lietať" (consultation modal for parrot
// owners) everywhere except the schools page, where visitors are teachers and
// organisers — there it jumps to the booking section instead.
export function usePageCta() {
  const { pathname } = useLocation();
  const { open: openKonzultacia } = useKonzultaciaModal();

  if (pathname === "/pre-skoly") {
    return {
      label: "Rezervovať prezentáciu",
      onClick: () => scrollToSection("rezervacia"),
    };
  }

  return { label: "Začať lietať", onClick: () => openKonzultacia() };
}
