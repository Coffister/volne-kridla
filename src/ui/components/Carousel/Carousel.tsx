import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

import Squircle from "@/ui/primitives/Squircle";
import type { Radius } from "@/ui/foundation/radius";

import styles from "./Carousel.module.css";

export interface CarouselImage {
  id: string;
  src: string;
  alt: string;
}

interface CarouselProps {
  images: CarouselImage[];
  radius?: Radius;
  className?: string;
  /** ms between automatic slides; 0 disables autoplay */
  autoplayInterval?: number;
  borderWidth?: number;
  borderColor?: string;
  /** external slide index (e.g. driven by thumbnails) — omit for uncontrolled use */
  activeIndex?: number;
  /** fires whenever the slide changes, from autoplay, drag, or activeIndex */
  onActiveIndexChange?: (index: number) => void;
}

// drag-to-swipe image carousel with autoplay — reused wherever the site needs
// a rotating photo frame (Hero, sub-page intros, ...)
export default function Carousel({
  images,
  radius = "lg",
  className,
  autoplayInterval = 4000,
  borderWidth = 0,
  borderColor,
  activeIndex,
  onActiveIndexChange,
}: CarouselProps) {
  const count = images.length;

  const [index, setIndex] = useState(activeIndex ?? 0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const startXRef = useRef(0);
  const widthRef = useRef(1);

  // stay in sync when a parent (e.g. thumbnail rail) drives the index
  useEffect(() => {
    if (activeIndex !== undefined) setIndex(activeIndex);
  }, [activeIndex]);

  const goTo = (next: number) => {
    setIndex(next);
    onActiveIndexChange?.(next);
  };

  useEffect(() => {
    if (isDragging || !autoplayInterval || count < 2) return;

    const id = setInterval(() => {
      goTo((index + 1) % count);
    }, autoplayInterval);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, count, autoplayInterval, index]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startXRef.current = event.clientX;
    widthRef.current = event.currentTarget.getBoundingClientRect().width || 1;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setDragOffset(event.clientX - startXRef.current);
  };

  const endDrag = () => {
    if (!isDragging) return;

    const threshold = widthRef.current * 0.15;

    if (dragOffset < -threshold) {
      goTo((index + 1) % count);
    } else if (dragOffset > threshold) {
      goTo((index - 1 + count) % count);
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const dragPercent = (dragOffset / widthRef.current) * 100;

  return (
    <Squircle
      radius={radius}
      className={`${styles.imageFrame} ${className ?? ""}`}
      borderWidth={borderWidth}
      borderColor={borderColor}
    >
      <div
        className={styles.carousel}
        data-cursor="drag"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(calc(${-index * 100}% + ${dragPercent}%))`,
            transition: isDragging ? "none" : undefined,
          }}
        >
          {images.map((image) => (
            <img
              key={image.id}
              src={image.src}
              alt={image.alt}
              className={styles.carouselSlide}
              draggable={false}
            />
          ))}
        </div>
      </div>
    </Squircle>
  );
}
