import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getLenis } from "@/lib/scroll";

// outgoing page: quick lift + fade so it feels like it steps aside
const EXIT_DURATION = 0.28;
const EXIT_Y = -14;
// incoming page: slightly longer settle so it glides into place
const ENTER_DURATION = 0.42;
const ENTER_Y = 16;
const BLUR = 6;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Crossfades between routed pages: the old page lifts + fades out, then the new
// one fades + drifts in. The shared shell (background, navbar, footer) never
// unmounts, so it keeps the "no loading" feel while smoothing the hard cut.
//
// We render a *snapshot* of the outlet (`shown.node`) rather than the live one.
// While the exit animation plays, the URL has already changed but we keep
// showing the previous page; only when the exit finishes do we swap in the new
// page and play the entrance.
export default function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();

  // always keep a handle on the newest outlet so the swap (which runs later,
  // from inside a GSAP callback) picks up the right page
  const latestOutlet = useRef(outlet);
  latestOutlet.current = outlet;

  const [shown, setShown] = useState(() => ({
    node: outlet,
    key: location.pathname,
  }));

  const containerRef = useRef<HTMLDivElement | null>(null);

  // route changed -> animate the current page out, then swap
  useEffect(() => {
    if (location.pathname === shown.key) return;

    const element = containerRef.current;

    const swap = () => {
      // land the incoming page at the top of the viewport
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo(0, 0);

      setShown({ node: latestOutlet.current, key: location.pathname });
    };

    if (!element || prefersReducedMotion()) {
      swap();
      return;
    }

    const tween = gsap.to(element, {
      opacity: 0,
      y: EXIT_Y,
      filter: `blur(${BLUR}px)`,
      duration: EXIT_DURATION,
      ease: "power2.in",
      overwrite: true,
      onComplete: swap,
    });

    // safety net in case the rAF loop is throttled (background tab)
    const safety = window.setTimeout(swap, EXIT_DURATION * 1000 + 300);

    return () => {
      window.clearTimeout(safety);
      tween.kill();
    };
  }, [location.pathname, shown.key]);

  // whenever a new page is shown, play its entrance
  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const reveal = () => {
      gsap.set(element, { clearProps: "opacity,filter,transform" });
      // the fresh page's own scroll-driven animations need to re-measure now
      // that layout and scroll position have changed
      ScrollTrigger.refresh();
    };

    if (prefersReducedMotion()) {
      gsap.set(element, { opacity: 1, y: 0, filter: "blur(0px)" });
      reveal();
      return;
    }

    const tween = gsap.fromTo(
      element,
      { opacity: 0, y: ENTER_Y, filter: `blur(${BLUR}px)` },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: ENTER_DURATION,
        ease: "power2.out",
        overwrite: true,
        onComplete: reveal,
      },
    );

    // safety net for a throttled rAF loop (background tab): drop every tween on
    // the node and force it to the finished, visible state
    const safety = window.setTimeout(() => {
      gsap.killTweensOf(element);
      gsap.set(element, { opacity: 1, y: 0, filter: "none" });
      ScrollTrigger.refresh();
    }, ENTER_DURATION * 1000 + 400);

    return () => {
      window.clearTimeout(safety);
      tween.kill();
    };
  }, [shown.key]);

  // one more refresh once images/fonts on the new page have settled
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [shown.key]);

  return (
    <div
      key={shown.key}
      ref={containerRef}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {shown.node}
    </div>
  );
}
