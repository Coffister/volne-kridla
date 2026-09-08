// Fixed, contrast-checked color choices for "color" type product variants —
// admins pick from this list instead of typing free text, and the storefront
// looks up the hex here to render a swatch next to the name.

export interface PaletteColor {
  label: string;
  hex: string;
}

export const COLOR_PALETTE: PaletteColor[] = [
  { label: "Červená", hex: "#E53935" },
  { label: "Modrá", hex: "#1E88E5" },
  { label: "Zelená", hex: "#43A047" },
  { label: "Žltá", hex: "#FDD835" },
  { label: "Oranžová", hex: "#FB8C00" },
  { label: "Fialová", hex: "#8E24AA" },
  { label: "Ružová", hex: "#EC407A" },
  { label: "Tyrkysová", hex: "#00ACC1" },
  { label: "Hnedá", hex: "#6D4C41" },
  { label: "Sivá", hex: "#9E9E9E" },
  { label: "Čierna", hex: "#212121" },
  { label: "Biela", hex: "#FFFFFF" },
];

export function colorHex(label: string): string | undefined {
  return COLOR_PALETTE.find((c) => c.label === label)?.hex;
}
