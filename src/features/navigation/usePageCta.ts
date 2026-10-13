import { useLocation } from "react-router-dom";

import { useKonzultaciaModal } from "@/features/konzultacia-modal";
import { useRezervaciaModal } from "@/features/rezervacia-modal";
import { markOpenSource } from "@/lib/analytics";

// The navbar / mobile bar CTA is "Začať lietať" (consultation modal for parrot
// owners) everywhere except the schools page, where visitors are teachers and
// organisers — there it opens the presentation booking modal instead.
/** `source` labels where the CTA sits, for the form-opened analytics event. */
export function usePageCta(source: string) {
  const { pathname } = useLocation();
  const { open: openKonzultacia } = useKonzultaciaModal();
  const { open: openRezervacia } = useRezervaciaModal();

  if (pathname === "/pre-skoly") {
    return {
      label: "Rezervovať prezentáciu",
      onClick: () => {
        markOpenSource(source);
        openRezervacia();
      },
    };
  }

  return {
    label: "Začať lietať",
    onClick: () => {
      markOpenSource(source);
      openKonzultacia();
    },
  };
}
