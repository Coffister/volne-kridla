import { useLocation } from "react-router-dom";

import { useKonzultaciaModal } from "@/features/konzultacia-modal";
import { useRezervaciaModal } from "@/features/rezervacia-modal";

// The navbar / mobile bar CTA is "Začať lietať" (consultation modal for parrot
// owners) everywhere except the schools page, where visitors are teachers and
// organisers — there it opens the presentation booking modal instead.
export function usePageCta() {
  const { pathname } = useLocation();
  const { open: openKonzultacia } = useKonzultaciaModal();
  const { open: openRezervacia } = useRezervaciaModal();

  if (pathname === "/pre-skoly") {
    return {
      label: "Rezervovať prezentáciu",
      onClick: () => openRezervacia(),
    };
  }

  return { label: "Začať lietať", onClick: () => openKonzultacia() };
}
