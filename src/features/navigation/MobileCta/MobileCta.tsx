import Button from "@/ui/components/Button";
import { useKonzultaciaModal } from "@/features/konzultacia-modal";

import styles from "./MobileCta.module.css";

// "Začať lietať" pinned to the bottom of the screen on mobile, where the
// navbar collapses into a menu and the CTA would otherwise be hidden in it.
// Lives outside the navbar on purpose: the navbar surface carries a scroll
// "squish" transform, and a position:fixed child of a transformed element is
// fixed to that element instead of the viewport.
export default function MobileCta() {
  const { open: openKonzultacia } = useKonzultaciaModal();

  return (
    // the footer reserves room for this bar at the bottom (Footer.module.css)
    <div className={styles.bar}>
      <Button
        variant="navbar"
        weight="bold"
        fullWidth
        className={styles.button}
        onClick={() => openKonzultacia()}
      >
        Začať lietať
      </Button>
    </div>
  );
}
