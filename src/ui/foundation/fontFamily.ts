export const fontFamily = {
    display: "League Spartan",
    body: "Poppins",
} as const;

export type FontFamily = keyof typeof fontFamily;