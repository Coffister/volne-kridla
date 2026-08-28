import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenisInstance: Lenis | null = null;
let rafHandler: ((time: number) => void) | null = null;
let initialized = false;

export function initializeScrollSystem() {
  if (initialized || typeof window === "undefined") {
    return lenisInstance;
  }

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    // lerp-based easing gives a continuous, buttery trail instead of the
    // fixed-duration "catch up" feel; lower = smoother / longer glide
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.6,
    syncTouch: false,
    gestureOrientation: "vertical",
    orientation: "vertical",
  });

  rafHandler = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(rafHandler);
  gsap.ticker.lagSmoothing(0);
  lenis.on("scroll", ScrollTrigger.update);

  lenisInstance = lenis;
  initialized = true;

  return lenis;
}

export function getLenis() {
  return lenisInstance;
}

export function destroyScrollSystem() {
  if (!initialized || !lenisInstance || !rafHandler) {
    return;
  }

  gsap.ticker.remove(rafHandler);
  lenisInstance.off("scroll", ScrollTrigger.update);
  lenisInstance.destroy();

  lenisInstance = null;
  rafHandler = null;
  initialized = false;
}
