import Button from "@/ui/components/Button";
import { usePageCta } from "../usePageCta";

import styles from "./MobileCta.module.css";

// "Začať lietať" pinned to the bottom of the screen on mobile, where the
// navbar collapses into a menu and the CTA would otherwise be hidden in it.
// Lives outside the navbar on purpose: the navbar surface carries a scroll
// "squish" transform, and a position:fixed child of a transformed element is
// fixed to that element instead of the viewport.
export default function MobileCta() {
  const cta = usePageCta();

  return (
    // the footer reserves room for this bar at the bottom (Footer.module.css)
    <div className={styles.bar}>
      <Button
        variant="navbar"
        weight="bold"
        fullWidth
        className={styles.button}
        onClick={cta.onClick}
      >
        {cta.label}
      </Button>
    </div>
  );
}
