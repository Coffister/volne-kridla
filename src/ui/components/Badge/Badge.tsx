import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

import Squircle from "@/ui/primitives/Squircle";
import Text from "@/ui/primitives/Text";

import styles from "./Badge.module.css";

interface BadgeProps {
    children: ReactNode;
}

export default function Badge({
    children,
}: BadgeProps) {
    const [rotate] = useState(() => `${(Math.random() * 4 - 2).toFixed(2)}deg`);

    return (
        <span
            className={styles.badgewrapper}
            style={{ "--badge-rotate": rotate } as CSSProperties}
        >
        <Squircle className={styles.badge} radius="xs">

            <div>

                <Text
                    as="span"
                    variant="sectionSubtitle"
                    weight="extrabold"
                >
                    {children}
                </Text>

            </div>

        </Squircle>
        </span>
    );
}