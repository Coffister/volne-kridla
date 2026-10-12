import { getLenis } from "@/lib/scroll";

// clearance below the floating navbar (same as Navbar's SCROLL_OFFSET)
const SCROLL_OFFSET = -120;

/** Smooth in-page jump to a section by id (Lenis-aware). */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset: SCROLL_OFFSET, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
