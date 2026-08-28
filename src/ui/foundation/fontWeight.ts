export const fontWeight = {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
} as const;

export type FontWeight = keyof typeof fontWeight;