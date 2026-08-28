import type { ReactNode } from "react";
import Squircle from "@/ui/primitives/Squircle";

import styles from "./Card.module.css";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export default function Card({
    children,
    className,
}: CardProps) {
    return (
        <Squircle radius="sm" borderWidth={4} borderColor="var(--color-border-primary)">
            <div className={`${styles.card} ${className ?? ""}`}>
                {children}
            </div>
        </Squircle>
    );
}