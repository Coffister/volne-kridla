import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Scroll-triggered entrance animations, driven by data attributes so sections
// only have to opt in (`reveal="up"` on a primitive / `data-reveal` on a tag):
//
//   up       — drift up + slight scale, settles with a soft overshoot (default)
//   pop      — badges/labels: grow from small with a little tilt + wobble
//   media    — images inside a clipped frame: zoom out into place
//   stagger  — the element itself stays put; its direct children reveal one
//              after another as "up"
//
// Everything that enters the viewport in the same frame is batched, so the
// above-the-fold content of a freshly shown page plays as one cascade (that's
// the page's entrance), and further sections cascade as they scroll in.
export type RevealVariant = "up" | "pop" | "media" | "stagger";

type ItemVariant = Exclude<RevealVariant, "stagger">;

const FROM: Record<ItemVariant, gsap.TweenVars> = {
  up: { opacity: 0, y: 44, scale: 0.94 },
  pop: { opacity: 0, scale: 0.6, rotate: -6 },
  media: { opacity: 0, scale: 1.14 },
};

const TO: Record<ItemVariant, gsap.TweenVars> = {
  up: { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.6)" },
  pop: { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: "elastic.out(1, 0.55)" },
  media: { opacity: 1, scale: 1, duration: 1.3, ease: "expo.out" },
};

const STAGGER = 0.08;
// cap so a long batch (e.g. a whole grid entering at once) doesn't drag on
const MAX_DELAY = 0.5;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function collect(root: HTMLElement) {
  const items: { el: HTMLElement; variant: ItemVariant }[] = [];

  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    const variant = el.dataset.reveal as RevealVariant;

    if (variant === "stagger") {
      Array.from(el.children).forEach((child) => {
        if (child instanceof HTMLElement && !child.hasAttribute("data-reveal")) {
          items.push({ el: child, variant: "up" });
        }
      });
      return;
    }

    items.push({ el, variant: variant in FROM ? variant : "up" });
  });

  return items;
}

// Hides every reveal target under `root` and wires up the scroll triggers.
// Call from a layout effect (before paint) so nothing flashes; returns cleanup.
export function setupReveals(root: HTMLElement) {
  if (prefersReducedMotion()) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  const items = collect(root);
  if (items.length === 0) return () => {};

  const variantOf = new Map(items.map(({ el, variant }) => [el, variant]));

  const ctx = gsap.context(() => {
    items.forEach(({ el, variant }) => gsap.set(el, FROM[variant]));

    const play = (targets: Element[]) => {
      targets.forEach((target, index) => {
        const el = target as HTMLElement;
        const variant = variantOf.get(el);
        if (!variant) return;
        // each element plays once, whichever trigger gets to it first
        variantOf.delete(el);

        gsap.to(el, {
          ...TO[variant],
          delay: Math.min(index * STAGGER, MAX_DELAY),
          overwrite: true,
          // hand the element back to its own CSS (hover transforms etc.)
          clearProps: "opacity,transform",
        });
      });
    };

    ScrollTrigger.batch(
      items.map(({ el }) => el),
      { start: "top 92%", once: true, onEnter: play },
    );

    // content in the page's last strip can never scroll up to 92% — once the
    // page's bottom edge is on screen, play whatever is still waiting
    ScrollTrigger.create({
      trigger: root,
      start: "bottom bottom",
      once: true,
      onEnter: () => play(Array.from(variantOf.keys())),
    });
  }, root);

  return () => ctx.revert();
}
