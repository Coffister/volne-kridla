import type { ReactNode } from "react";

import { useParallax } from "@/hooks/useParallax";

import clouds from "@/assets/core/background.webp";
import cloudsSmall from "@/assets/core/background-800.webp";

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
                srcSet={`${cloudsSmall} 800w, ${clouds} 1600w`}
                sizes="100vw"
                alt=""
                aria-hidden
                className={styles.background}
            />

            <main className={styles.content}>
                {children}
            </main>

        </div>
    );
}