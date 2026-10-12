import type { ReactNode } from "react";

import Squircle from "@/ui/primitives/Squircle";
import Text from "@/ui/primitives/Text";

import styles from "../Button/Button.module.css";
import { buttonRecipe } from "../Button/recipe";

import type { ButtonSize, ButtonVariant } from "../Button/recipe";
import type { FontWeight } from "@/ui/foundation/fontWeight";

interface LinkButtonProps {
  children: ReactNode;

  href: string;

  variant?: ButtonVariant;
  size?: ButtonSize;

  target?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  weight?: FontWeight;
  className?: string;
}

export default function LinkButton({
  children,
  href,

  icon,
  iconPosition = "left",

  variant = "primary",
  size = "md",

  target,
  weight,
  className = "",
}: LinkButtonProps) {
  const recipe = buttonRecipe({
    variant,
    size,
  });

  return (
    <a
      href={href}
      target={target}
      // a new tab must not get a handle back to this page
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={`${styles.button} ${recipe.variant} ${className}`}
    >
      <Squircle radius="lg">
        <span
          className={`${styles.content} ${recipe.size} ${
            icon && iconPosition === "right" ? styles.iconRight : ""
          }`}
        >
          {icon && iconPosition === "left" ? (
            <span className={styles.icon} aria-hidden>
              {icon}
            </span>
          ) : null}

          <Text as="span" variant="button" weight={weight}>
            {children}
          </Text>

          {icon && iconPosition === "right" ? (
            <span className={styles.icon} aria-hidden>
              {icon}
            </span>
          ) : null}
        </span>
      </Squircle>
    </a>
  );
}
