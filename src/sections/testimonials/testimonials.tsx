import { useEffect, useRef } from "react";
import { Container, Stack, Text, Section } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";

import ReviewCard from "@/sections/testimonials/ReviewCard";
import { testimonials as fallbackTestimonials } from "./testimonial-map";
import { site } from "@/content";

import styles from "./testimonials.module.css";

// Prefer reviews managed in the admin (baked in at build time); fall back to
// the hardcoded list until the reviews table has content. The admin stores
// plain name/text — the "@" and quote marks are decoration added here, to
// match the fallback list where they're already baked into the copy.
const testimonials = site.reviews.length
  ? site.reviews.map((r) => ({
      id: r.id,
      clientName: `@${r.author}`,
      text: `“${r.body}”`,
      image: r.image,
    }))
  : fallbackTestimonials;

// repeated 3x so the track can silently jump between identical sets and loop forever
const loopedTestimonials = [...testimonials, ...testimonials, ...testimonials];

const DRAG_EASE = 0.06;
const AUTOPLAY_EASE = 0.035;
const FRICTION = 0.92;
const VELOCITY_STOP_THRESHOLD = 0.05;
// how long the view sits still before it drifts on to the next card, on its own
const AUTOPLAY_INTERVAL = 5000;
// how long native scrolling has to be quiet before autoplay is allowed to resume
const NATIVE_SCROLL_SETTLE_DELAY = 150;

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const velocityRef = useRef(0);
  const cardStepRef = useRef(0);
  const cardOffsetRef = useRef(0);

  const isDraggingRef = useRef(false);
  const isAutoplayingRef = useRef(false);
  const isActiveRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const startXRef = useRef(0);
  const startTargetRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  // last scrollLeft value we set ourselves — lets us tell a real user scroll
  // apart from an async echo of our own animation (which can arrive after
  // the animation already reports itself as finished)
  const lastSetScrollLeftRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const setWidth = track.scrollWidth / 3;

    const cards = Array.from(track.children) as HTMLElement[];
    const cardWidth = cards.length > 0 ? cards[0].getBoundingClientRect().width : 0;
    cardStepRef.current = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
    // scrollLeft that puts a card's centre in the middle of the viewport, not flush against its left edge
    cardOffsetRef.current =
      cards.length > 0 ? cards[0].offsetLeft - (track.clientWidth - cardWidth) / 2 : 0;

    const nearestCardPosition = (value: number) => {
      const pitch = cardStepRef.current;
      if (!pitch) return value;
      const offset = cardOffsetRef.current;
      return offset + Math.round((value - offset) / pitch) * pitch;
    };

    const initial = nearestCardPosition(setWidth);
    currentRef.current = initial;
    targetRef.current = initial;
    track.scrollLeft = initial;
    lastSetScrollLeftRef.current = track.scrollLeft;

    const wrap = () => {
      if (currentRef.current < setWidth * 0.5) {
        currentRef.current += setWidth;
        targetRef.current += setWidth;
        // an active drag's target is computed from this anchor each pointermove —
        // shift it too, or the next move jumps back across the whole set
        if (isDraggingRef.current) startTargetRef.current += setWidth;
      } else if (currentRef.current > setWidth * 1.5) {
        currentRef.current -= setWidth;
        targetRef.current -= setWidth;
        if (isDraggingRef.current) startTargetRef.current -= setWidth;
      }
    };

    const step = () => {
      const ease = isAutoplayingRef.current ? AUTOPLAY_EASE : DRAG_EASE;
      currentRef.current += (targetRef.current - currentRef.current) * ease;

      if (!isDraggingRef.current && velocityRef.current !== 0) {
        targetRef.current += velocityRef.current;
        velocityRef.current *= FRICTION;

        if (Math.abs(velocityRef.current) < VELOCITY_STOP_THRESHOLD) {
          velocityRef.current = 0;
        }
      }

      wrap();
      track.scrollLeft = currentRef.current;
      lastSetScrollLeftRef.current = track.scrollLeft;

      const settled =
        !isDraggingRef.current &&
        velocityRef.current === 0 &&
        Math.abs(targetRef.current - currentRef.current) < 0.5;

      if (settled) {
        isActiveRef.current = false;
        isAutoplayingRef.current = false;
        rafIdRef.current = null;
        return;
      }

      rafIdRef.current = requestAnimationFrame(step);
    };

    const startLoop = () => {
      if (isActiveRef.current) return;
      isActiveRef.current = true;
      rafIdRef.current = requestAnimationFrame(step);
    };

    let autoplayInterval: ReturnType<typeof setInterval> | undefined;

    const stopAutoplay = () => {
      clearInterval(autoplayInterval);
      autoplayInterval = undefined;
    };

    // after a few quiet seconds, drift on to the next card — and keep doing that
    // until the user grabs the track again
    const startAutoplay = () => {
      stopAutoplay();
      autoplayInterval = setInterval(() => {
        targetRef.current = nearestCardPosition(currentRef.current) + cardStepRef.current;
        isAutoplayingRef.current = true;
        startLoop();
      }, AUTOPLAY_INTERVAL);
    };

    let nativeScrollSettleTimeout: ReturnType<typeof setTimeout> | undefined;

    // native input (wheel / touch / trackpad) while we're not driving the track ourselves
    const handleNativeScroll = () => {
      if (isActiveRef.current) return;
      // this can be an async echo of a scrollLeft assignment WE made, arriving
      // after our own animation already reported itself as finished — ignore it
      if (Math.abs(track.scrollLeft - lastSetScrollLeftRef.current) < 0.5) return;

      stopAutoplay();

      if (track.scrollLeft < setWidth * 0.5) {
        track.scrollLeft += setWidth;
      } else if (track.scrollLeft > setWidth * 1.5) {
        track.scrollLeft -= setWidth;
      }

      lastSetScrollLeftRef.current = track.scrollLeft;
      currentRef.current = track.scrollLeft;
      targetRef.current = track.scrollLeft;

      clearTimeout(nativeScrollSettleTimeout);
      nativeScrollSettleTimeout = setTimeout(startAutoplay, NATIVE_SCROLL_SETTLE_DELAY);
    };

    track.addEventListener("scroll", handleNativeScroll);

    const handlePointerDown = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      stopAutoplay();
      clearTimeout(nativeScrollSettleTimeout);
      isAutoplayingRef.current = false;

      // native scroll may have moved the track since we last drove it — resync
      currentRef.current = track.scrollLeft;
      targetRef.current = track.scrollLeft;
      velocityRef.current = 0;

      isDraggingRef.current = true;
      startXRef.current = event.clientX;
      startTargetRef.current = targetRef.current;
      lastXRef.current = event.clientX;
      lastTimeRef.current = performance.now();

      try {
        track.setPointerCapture(event.pointerId);
      } catch {
        // ignore — dragging still works via the listeners on the track itself
      }
      startLoop();
    };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      if (!isDraggingRef.current) return;

      targetRef.current = startTargetRef.current - (event.clientX - startXRef.current);

      const now = performance.now();
      const dt = now - lastTimeRef.current;
      if (dt > 0) {
        velocityRef.current = (-(event.clientX - lastXRef.current) / dt) * 16;
      }
      lastXRef.current = event.clientX;
      lastTimeRef.current = now;
    };

    const endDrag = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      startLoop();
      startAutoplay();
    };

    track.addEventListener("pointerdown", handlePointerDown);
    track.addEventListener("pointermove", handlePointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("pointerleave", endDrag);

    startAutoplay();

    return () => {
      stopAutoplay();
      clearTimeout(nativeScrollSettleTimeout);
      track.removeEventListener("scroll", handleNativeScroll);
      track.removeEventListener("pointerdown", handlePointerDown);
      track.removeEventListener("pointermove", handlePointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("pointerleave", endDrag);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <Stack direction="column" align="center" className={styles.sectionheader}>
          <Text as="h2" variant="sectionTitle" className={styles.title}>
            Vidíš ich? Tí už spravili prvý krok.
          </Text>
          <Badge>Ty môžeš byť ďalší, kto dá svojmu papagájovi slobodu.</Badge>
        </Stack>
      </Container>

      <div ref={trackRef} className={styles.track} data-cursor="drag">
        {loopedTestimonials.map((testimonial, index) => (
          <ReviewCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
        ))}
      </div>
    </Section>
  );
}
