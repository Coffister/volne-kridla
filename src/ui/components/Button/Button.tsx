import type { ReactNode } from "react";

import Text from "@/ui/primitives/Text";
import type { FontWeight } from "@/ui/foundation/fontWeight";

import { buttonRecipe } from "./recipe";
import type { ButtonSize, ButtonVariant } from "./recipe";

import styles from "./Button.module.css";

interface ButtonProps {
  children?: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  type?: "button" | "submit" | "reset";

  variant?: ButtonVariant;
  size?: ButtonSize;
  weight?: FontWeight;

  bordered?: boolean;
  fullWidth?: boolean;
  fullwidth?: boolean;

  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export default function Button({
  children,
  icon,
  iconPosition = "left",
  className = "",
  type = "button",

  variant = "primary",
  size = "sm",
  weight = "extrabold",

  fullWidth,
  fullwidth,

  disabled,
  onClick,
  ariaLabel,
}: ButtonProps) {
  const recipe = buttonRecipe({
    variant,
    size,
  });

  const isLabelSize = size === "label";
  const isFullWidth = Boolean(fullWidth || fullwidth);
  const isIconOnly = !children;

  return (
    <button
      type={type}
      className={`${styles.button} ${recipe.variant} ${className} ${
        isFullWidth ? styles.fullWidth : ""
      }`}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
        <span
          className={`${styles.content} ${recipe.size} ${
            icon && iconPosition === "right" && !isIconOnly ? styles.iconRight : ""
          }`}
        >
          {icon && (iconPosition === "left" || isIconOnly) ? (
            <span
              className={`${styles.icon} ${isIconOnly ? styles.iconOnly : ""}`}
              aria-hidden
            >
              {icon}
            </span>
          ) : null}

          {!isIconOnly && (
            <Text
              as="span"
              variant="button"
              weight={weight}
              style={
                isLabelSize
                  ? { fontSize: "var(--font-size-label)", lineHeight: 1.5 }
                  : undefined
              }
            >
              {children}
            </Text>
          )}

          {icon && iconPosition === "right" && !isIconOnly ? (
            <span className={styles.icon} aria-hidden>
              {icon}
            </span>
          ) : null}
        </span>
    </button>
  );
}
