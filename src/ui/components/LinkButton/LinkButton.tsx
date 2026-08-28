import type { ReactNode } from "react";

import Squircle from "@/ui/primitives/Squircle";
import Text from "@/ui/primitives/Text";

import styles from "../Button/Button.module.css";
import { buttonRecipe } from "../Button/recipe";

import type { ButtonSize, ButtonVariant } from "../Button/recipe";

interface LinkButtonProps {
  children: ReactNode;

  href: string;

  variant?: ButtonVariant;
  size?: ButtonSize;

  target?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export default function LinkButton({
  children,
  href,

  icon,
  iconPosition = "left",

  variant = "primary",
  size = "md",

  target,
}: LinkButtonProps) {
  const recipe = buttonRecipe({
    variant,
    size,
  });

  return (
    <a
      href={href}
      target={target}
      className={`${styles.button} ${recipe.variant}`}
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

          <Text as="span" variant="button">
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
