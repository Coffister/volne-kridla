import type { ReactNode } from "react";

import Squircle from "@/ui/primitives/Squircle";
import Text from "@/ui/primitives/Text";
import type { FontWeight } from "@/ui/foundation/fontWeight";

import { buttonRecipe } from "./recipe";
import type { ButtonSize, ButtonVariant } from "./recipe";

import styles from "./Button.module.css";

interface ButtonProps {
  children: ReactNode;
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

  bordered = false,
  fullWidth,
  fullwidth,

  disabled,
  onClick,
}: ButtonProps) {
  const recipe = buttonRecipe({
    variant,
    size,
  });

  const isLabelSize = size === "label";
  const isFullWidth = Boolean(fullWidth || fullwidth);

  return (
    <button
      type={type}
      className={`${styles.button} ${recipe.variant} ${className} ${
        isFullWidth ? styles.fullWidth : ""
      }`}
      disabled={disabled}
      onClick={onClick}
    >
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

          {icon && iconPosition === "right" ? (
            <span className={styles.icon} aria-hidden>
              {icon}
            </span>
          ) : null}
        </span>
    </button>
  );
}
