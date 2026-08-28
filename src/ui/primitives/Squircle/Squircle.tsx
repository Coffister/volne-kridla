import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { radius as radiusTokens } from "@/ui/foundation/radius";
import type { Radius } from "@/ui/foundation/radius";

export type CornerKey = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";
export type CornerRadius = Partial<Record<CornerKey, number>>;

function clampRadius(value: number, max: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(value, max));
}

function buildRectanglePath(width: number, height: number, cornerRadius: CornerRadius) {
    const maxRadius = Math.min(width, height) / 2;
    const r = {
        topLeft: clampRadius(cornerRadius.topLeft ?? 0, maxRadius),
        topRight: clampRadius(cornerRadius.topRight ?? 0, maxRadius),
        bottomRight: clampRadius(cornerRadius.bottomRight ?? 0, maxRadius),
        bottomLeft: clampRadius(cornerRadius.bottomLeft ?? 0, maxRadius),
    };

    const x = 0;
    const y = 0;
    const right = width;
    const bottom = height;

    const commands = [
        `M ${x + r.topLeft} ${y}`,
        `H ${right - r.topRight}`,
        `A ${r.topRight} ${r.topRight} 0 0 1 ${right} ${y + r.topRight}`,
        `V ${bottom - r.bottomRight}`,
        `A ${r.bottomRight} ${r.bottomRight} 0 0 1 ${right - r.bottomRight} ${bottom}`,
        `H ${x + r.bottomLeft}`,
        `A ${r.bottomLeft} ${r.bottomLeft} 0 0 1 ${x} ${bottom - r.bottomLeft}`,
        `V ${y + r.topLeft}`,
        `A ${r.topLeft} ${r.topLeft} 0 0 1 ${x + r.topLeft} ${y}`,
        "Z",
    ];

    return commands.join(" ");
}

function resolveCornerRadius(radius: Radius | number | CornerRadius): CornerRadius {
    if (typeof radius === "number") {
        return {
            topLeft: radius,
            topRight: radius,
            bottomRight: radius,
            bottomLeft: radius,
        };
    }

    if (typeof radius === "string") {
        const value = radiusTokens[radius as keyof typeof radiusTokens];
        return {
            topLeft: value,
            topRight: value,
            bottomRight: value,
            bottomLeft: value,
        };
    }

    return {
        topLeft: radius.topLeft ?? 0,
        topRight: radius.topRight ?? 0,
        bottomRight: radius.bottomRight ?? 0,
        bottomLeft: radius.bottomLeft ?? 0,
    };
}

interface SquircleProps {
    children: ReactNode;
    radius?: Radius | number | CornerRadius;
    borderWidth?: number;
    borderColor?: string;
    className?: string;
    style?: CSSProperties;
}

export default function Squircle({
    children,
    radius = "md",
    borderWidth = 0,
    borderColor = "transparent",
    className,
    style,
}: SquircleProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [svgPath, setSvgPath] = useState("");

    const rawCornerRadius = resolveCornerRadius(radius);
    // Stable primitive dependency — the resolved object is a fresh reference on
    // every render, which would otherwise re-run the effect (and re-attach the
    // ResizeObserver) in a loop.
    const radiusKey = `${rawCornerRadius.topLeft}|${rawCornerRadius.topRight}|${rawCornerRadius.bottomRight}|${rawCornerRadius.bottomLeft}`;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const cornerRadius = resolveCornerRadius(radius);

        const updatePath = () => {
            const { width, height } = el.getBoundingClientRect();

            const path =
                width > 0 && height > 0
                    ? buildRectanglePath(width, height, cornerRadius)
                    : "";

            // Bail out when nothing changed so a ResizeObserver callback can't
            // feed a no-op state update back into a render -> observe loop.
            setSize((prev) =>
                Math.abs(prev.width - width) < 0.5 && Math.abs(prev.height - height) < 0.5
                    ? prev
                    : { width, height },
            );
            setSvgPath((prev) => (prev === path ? prev : path));
        };

        updatePath();

        const observer = new ResizeObserver(updatePath);
        observer.observe(el);

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [radiusKey]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: "relative",
                clipPath: svgPath ? `path('${svgPath}')` : undefined,
                ...style,
            }}
        >
            {children}
            {borderWidth > 0 && svgPath && (
                <svg
                    width={size.width}
                    height={size.height}
                    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
                >
                    <path
                        d={svgPath}
                        fill="none"
                        stroke={borderColor}
                        strokeWidth={borderWidth * 2}
                    />
                </svg>
            )}
        </div>
    );
}