import type {
    CSSProperties,
    ElementType,
    ReactNode,
} from "react";

import { typography } from "@/ui/foundation/typography";
import type { Typography } from "@/ui/foundation/typography";
import { fontWeight } from "@/ui/foundation/fontWeight";
import type { FontWeight } from "@/ui/foundation/fontWeight";

export interface TextProps {
    as?: ElementType;
    variant?: Typography;
    weight?: FontWeight;

    children: ReactNode;

    className?: string;
    style?: CSSProperties;
}

export default function Text({
    as: Component = "span",
    variant = "body",
    weight,

    children,

    className,
    style,
}: TextProps) {
    return (
        <Component
            className={className}
            style={{
                ...typography[variant],
                ...(weight ? { fontWeight: fontWeight[weight] } : null),
                ...style,
            }}
        >
            {children}
        </Component>
    );
}