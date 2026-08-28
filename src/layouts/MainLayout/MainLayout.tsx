import type { ReactNode } from "react";

import Grain from "@/ui/effects/Grain";
import { useParallax } from "@/hooks/useParallax";

import clouds from "@/assets/core/background.webp";

import styles from "./MainLayout.module.css";


interface MainLayoutProps {
    children: ReactNode;
}


export default function MainLayout({
    children,
}: MainLayoutProps) {

    const cloudsRef = useParallax<HTMLImageElement>({ speed: -16 });

    return (
        <div className={styles.layout}>

            <img
                ref={cloudsRef}
                src={clouds}
                alt=""
                aria-hidden
                className={styles.background}
            />

            <main className={styles.content}>
                {children}
            </main>

            <Grain />

        </div>
    );
}