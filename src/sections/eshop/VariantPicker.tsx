import type { ProductVariant } from "@/content";
import { colorHex } from "@/content/colorPalette";
import { Stack, Text } from "@/ui/primitives";
import Select from "@/ui/components/Select";
import styles from "./ProductPage.module.css";

interface VariantPickerProps {
  variants: ProductVariant[];
  value: Record<string, string>;
  onChange: (label: string, option: string) => void;
  /** lay the variants out side by side (wraps when narrow) */
  columns?: boolean;
}

export default function VariantPicker({ variants, value, onChange, columns }: VariantPickerProps) {
  return (
    <Stack
      direction="column"
      gap={columns ? "sm" : "xs"}
      className={styles.variants}
      style={columns ? { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" } : undefined}
    >
      {variants.map((variant) => (
        <Stack key={variant.label} direction="column" gap="xs">
          <Text as="label" variant="caption">
            {variant.label}
          </Text>
          {variant.isColor ? (
            <Stack direction="row" align="center" gap="sm" wrap="wrap">
              <Stack direction="row" gap="xs" wrap="wrap" className={styles.swatches}>
                {variant.options.map((option) => {
                  const isSelected = value[variant.label] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      title={option}
                      aria-label={option}
                      aria-pressed={isSelected}
                      className={`${styles.swatch} ${isSelected ? styles.swatchSelected : ""}`}
                      style={{ backgroundColor: colorHex(option) ?? "#ccc" }}
                      onClick={() => onChange(variant.label, option)}
                    />
                  );
                })}
              </Stack>
              <Text as="span" variant="caption">
                {value[variant.label] || "zvoľte farbu"}
              </Text>
            </Stack>
          ) : (
            <Select
              options={variant.options}
              value={value[variant.label] || ""}
              onChange={(option) => onChange(variant.label, option)}
              placeholder="zvoľte možnosť"
            />
          )}
        </Stack>
      ))}
    </Stack>
  );
}
